import { Request, Response } from "express";
import axios from "axios";
import { OrderModel } from "../models/order.model";
import { CouponModel } from "../models/coupon.model";
import { redisClient } from "../db/redis";
import { sendErrorResponse } from "../utils/error-response.util";
import { logger } from "../utils/logger";
import { AuthRequest } from "../middlewares/auth.middleware";
import { calculateDiscount } from "../utils/discount.utils";

const TTL = Number(process.env.CACHE_TTL_SECONDS || 120);
const CATALOG_URL = process.env.CATALOG_SERVICE_URL || "http://127.0.0.1:4002";
const NOTIFY_URL = process.env.NOTIFICATION_SERVICE_URL || "http://127.0.0.1:4004";

type CreateOrderBody = {
  items: { itemId: string; quantity: number }[];
  couponId?: string;
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body as CreateOrderBody;

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return sendErrorResponse(res, 400, "items are required", "VALIDATION_ERROR");
    }

    const customerId = req.user?.userId;
    if (!customerId) {
      return sendErrorResponse(res, 401, "Unauthorized", "UNAUTHORIZED");
    }

    // 1) Fetch menu items from catalog-service
    // simplest approach: call GET /items and filter (fine for now)
    const token = req.headers.authorization; // forward token
    const resp = await axios.post(
      `${CATALOG_URL}/items/by-ids`,
      { ids: body.items.map((i) => i.itemId) },
      { headers: { Authorization: token } }
    );

    const menuItems: any[] = resp.data?.data || [];

    // Create lookup map: itemId -> menuItem
    const menuMap = new Map(menuItems.map((m) => [String(m._id), m]));

    let totalAmount = 0;

    const orderItems = body.items.map((item) => {
      const found = menuMap.get(item.itemId);
      if (!found) {
        throw new Error(`INVALID_ITEM:${item.itemId}`);
      }

      const price = Number(found.price);
      const quantity = Number(item.quantity);

      totalAmount += price * quantity;

      return {
        itemId: item.itemId,
        name: found.name,
        price,
        quantity,
      };
    });

    // 3) Fetch coupon if couponId is provided
    let coupon = null;
    if (body.couponId) {
      coupon = await CouponModel.findById(body.couponId);
      if (!coupon) {
        return sendErrorResponse(res, 400, "Invalid coupon ID", "VALIDATION_ERROR");
      }
    }

    // 4) Calculate discount using strategy pattern (simple functions)
    const discount = calculateDiscount(totalAmount, coupon);

    // 5) save order
    const order = await OrderModel.create({
      customerId,
      items: orderItems,
      totalAmount,
      discount,
      status: "CREATED",
    });

    // 6) cache invalidation: order:<id>
    await redisClient.del(`order:${order._id}`);

    // 7) trigger notification-service (async)
    axios
      .post(
        `${NOTIFY_URL}/notify`,
        {
          type: "ORDER_CREATED",
          orderId: order._id,
          customerId,
        },
        { headers: { Authorization: token } }
      )
      .catch((err) => {
        logger("error", "Notification trigger failed", { errorMessage: err.message });
      });

    return res.status(201).json({
      success: true,
      data: order,
      error: null,
    });
  } catch (err: any) {
    // Handle invalid item nicely
    if (typeof err.message === "string" && err.message.startsWith("INVALID_ITEM:")) {
      const itemId = err.message.split(":")[1];
      return sendErrorResponse(res, 400, `Invalid itemId: ${itemId}`, "VALIDATION_ERROR");
    }

    logger("error", "Create order failed", { errorMessage: err.message });
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.userId;

    if (!customerId) {
      return sendErrorResponse(res, 401, "Unauthorized", "UNAUTHORIZED");
    }

    const cacheKey = `order:${id}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger("info", "Order cache hit", { cacheKey, cacheHit: true });
      return res.json({
        success: true,
        data: JSON.parse(cached),
        error: null,
      });
    }

    logger("info", "Order cache miss", { cacheKey, cacheHit: false });

    const order = await OrderModel.findById(id).lean();
    if (!order) {
      return sendErrorResponse(res, 404, "Order not found", "NOT_FOUND");
    }

    // Optional security: allow only owner
    if (String(order.customerId) !== String(customerId)) {
      return sendErrorResponse(res, 403, "Forbidden", "FORBIDDEN");
    }

    await redisClient.setEx(cacheKey, TTL, JSON.stringify(order));

    return res.json({
      success: true,
      data: order,
      error: null,
    });
  } catch (err: any) {
    logger("error", "Get order failed", { errorMessage: err.message });
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};
