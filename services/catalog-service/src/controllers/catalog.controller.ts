import { Request, Response } from "express";
import { MenuItemModel } from "../models/menuItem.model";
import { redisClient } from "../db/redis";
import { sendErrorResponse } from "@crmp/common";
import { logger } from "@crmp/common";
import mongoose from "mongoose";

const TTL = Number(process.env.CACHE_TTL_SECONDS || 60);
type ItemsByIdsBody = {
  ids: string[];
};
export const getItems = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const cacheKey = category ? `menu:category:${category}` : "menu:all";

    // 1) check cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger("info", "Menu cache hit", { cacheKey, cacheHit: true });

      return res.json({
        success: true,
        data: JSON.parse(cached),
        error: null,
      });
    }

    logger("info", "Menu cache miss", { cacheKey, cacheHit: false });

    // 2) fetch from DB
    const filter: any = {};
    if (category) filter.category = category;

    const items = await MenuItemModel.find(filter).lean();

    // 3) save to cache
    await redisClient.setEx(cacheKey, TTL, JSON.stringify(items));

    return res.json({
      success: true,
      data: items,
      error: null,
    });
  } catch (err: any) {
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const { name, price, category, description, isAvailable } = req.body;

    if (!name || price == null || !category) {
      return sendErrorResponse(
        res,
        400,
        "name, price and category are required",
        "VALIDATION_ERROR"
      );
    }

    const item = await MenuItemModel.create({
      name,
      price,
      category,
      description,
      isAvailable: isAvailable ?? true,
    });

    // cache invalidation
    await redisClient.del("menu:all");
    await redisClient.del(`menu:category:${category}`);

    logger("info", "Menu cache invalidated", {
      keys: ["menu:all", `menu:category:${category}`],
    });

    return res.status(201).json({
      success: true,
      data: item,
      error: null,
    });
  } catch (err: any) {
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};

export const getItemsByIds = async (req: Request, res: Response) => {
  try {
    const body = req.body as ItemsByIdsBody;

    if (!body?.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      return sendErrorResponse(res, 400, "ids array is required", "VALIDATION_ERROR");
    }

    // validate Mongo ObjectIds
    const invalidIds = body.ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return sendErrorResponse(
        res,
        400,
        `Invalid item ids: ${invalidIds.join(", ")}`,
        "VALIDATION_ERROR"
      );
    }

    const objectIds = body.ids.map((id: string) => new mongoose.Types.ObjectId(id));

    // Fetch only requested items (projection -> keep response small)
    const items = await MenuItemModel.find({ _id: { $in: objectIds } })
      .select("name price category isAvailable")
      .lean();

    logger("info", "Fetched menu items by ids", {
      requestedCount: body.ids.length,
      foundCount: items.length,
    });

    return res.json({
      success: true,
      data: items,
      error: null,
    });
  } catch (err: any) {
    logger("error", "Failed to fetch items by ids", { errorMessage: err.message });
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};
