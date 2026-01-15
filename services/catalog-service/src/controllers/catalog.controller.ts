import { Request, Response } from "express";
import { MenuItemModel } from "../models/menuItem.model";
import { redisClient } from "../db/redis";
import { sendErrorResponse } from "../utils/error-response.util";

const TTL = Number(process.env.CACHE_TTL_SECONDS || 60);

export const getItems = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const cacheKey = category ? `menu:category:${category}` : "menu:all";

    // 1) check cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(
        JSON.stringify({
          level: "info",
          service: process.env.SERVICE_NAME,
          msg: "Menu cache hit",
          cacheKey,
          cacheHit: true,
        })
      );

      return res.json({
        success: true,
        data: JSON.parse(cached),
        error: null,
      });
    }

    console.log(
      JSON.stringify({
        level: "info",
        service: process.env.SERVICE_NAME,
        msg: "Menu cache miss",
        cacheKey,
        cacheHit: false,
      })
    );

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

    // ✅ cache invalidation
    await redisClient.del("menu:all");
    await redisClient.del(`menu:category:${category}`);

    console.log(
      JSON.stringify({
        level: "info",
        service: process.env.SERVICE_NAME,
        msg: "Menu cache invalidated",
        keys: ["menu:all", `menu:category:${category}`],
      })
    );

    return res.status(201).json({
      success: true,
      data: item,
      error: null,
    });
  } catch (err: any) {
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};
