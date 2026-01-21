import { ApiError, logger } from "@crmp/common";
import { catalogClient } from "../clients/catalog.client";
import { notificationClient } from "../clients/notification.client";
import { couponRepository } from "../repositories/coupon.repository";
import { orderRepository } from "../repositories/order.repository";
import { orderCacheService } from "./orderCache.service";
import { cacheKeys } from "../constants/cacheKeys";
import { calculateDiscount } from "../utils/discount.utils";

type CreateOrderBody = {
    items: { itemId: string; quantity: number }[];
    couponCode?: string;
};

export const orderService = {
    async createOrder(customerId: string, body: CreateOrderBody, token?: string) {
        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            throw new ApiError(400, "items are required");
        }

        // 1) Fetch menu items from catalog-service
        const ids = body.items.map((i) => i.itemId);
        const menuItems: any[] = await catalogClient.getItemsByIds(ids, token);

        // map itemId -> menuItem
        const menuMap = new Map(menuItems.map((m) => [String(m._id), m]));

        let totalAmount = 0;

        const orderItems = body.items.map((item) => {
            const found = menuMap.get(item.itemId);
            if (!found) {
                // instead of throw Error("INVALID_ITEM:xx"), throw ApiError
                throw new ApiError(400, `Invalid itemId: ${item.itemId}`);
            }

            const price = Number(found.price);
            const quantity = Number(item.quantity);
            totalAmount += price * quantity;

            return { itemId: item.itemId, name: found.name, price, quantity };
        });

        // 2) coupon validation
        let coupon: any = null;
        if (body.couponCode) {
            coupon = await couponRepository.findByCode(body.couponCode.toUpperCase());
            if (!coupon) throw new ApiError(400, "Invalid coupon code");
        }

        // 3) Calculate discount
        const discount = calculateDiscount(totalAmount, coupon);

        // 4) save order
        const order = await orderRepository.create({
            customerId,
            items: orderItems,
            totalAmount,
            discount,
            status: "CREATED",
        });

        // 5) cache invalidation
        await orderCacheService.del(cacheKeys.orderById(String(order._id)));

        // 6) trigger notification-service async
        await notificationClient.triggerOrderCreated(
            {
                eventType: "ORDER_CREATED",
                channels: ["EMAIL", "SMS", "PUSH"],
                user: {
                    email: "customer@gmail.com",
                    phone: "+919999999999",
                    deviceToken: "DEVICE_TOKEN_HERE",
                },
                data: {
                    orderId: String(order._id),
                    totalAmount: order.totalAmount,
                },
                traceId: String(order._id),
            },
            token
        );

        return order;
    },

    async getOrderById(orderId: string, customerId: string) {
        const cacheKey = cacheKeys.orderById(orderId);

        const cached = await orderCacheService.get<any>(cacheKey);
        if (cached) return cached;

        logger("info", "Order cache miss", { cacheKey, cacheHit: false });

        const order = await orderRepository.findByIdLean(orderId);
        if (!order) throw new ApiError(404, "Order not found");

        // allow only owner
        if (String(order.customerId) !== String(customerId)) {
            throw new ApiError(403, "Forbidden");
        }

        await orderCacheService.set(cacheKey, order);
        return order;
    },
};
