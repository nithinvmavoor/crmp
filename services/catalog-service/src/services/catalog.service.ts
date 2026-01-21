import mongoose from "mongoose";
import { ApiError, logger } from "@crmp/common";
import { menuItemRepository } from "../repositories/menuItem.repository";
import { catalogCacheService } from "./catalogCache.service";
import { cacheKeys } from "../constants/cacheKeys";

type CreateItemPayload = {
    name: string;
    price: number;
    category: string;
    description?: string;
    isAvailable?: boolean;
};

export const catalogService = {
    async getItems(category?: string) {
        const cacheKey = category
            ? cacheKeys.menuByCategory(category)
            : cacheKeys.menuAll();

        // 1) cache
        const cached = await catalogCacheService.get<any[]>(cacheKey);
        if (cached) return cached;

        logger("info", "Menu cache miss", { cacheKey, cacheHit: false });

        // 2) DB
        const filter: any = {};
        if (category) filter.category = category;

        const items = await menuItemRepository.findAll(filter);

        // 3) save cache
        await catalogCacheService.set(cacheKey, items);

        return items;
    },

    async createItem(payload: CreateItemPayload) {
        const { name, price, category, description, isAvailable } = payload;

        if (!name || price == null || !category) {
            throw new ApiError(400, "name, price and category are required");
        }

        const item = await menuItemRepository.create({
            name,
            price,
            category,
            description,
            isAvailable: isAvailable ?? true,
        });

        // cache invalidation
        await catalogCacheService.del([
            cacheKeys.menuAll(),
            cacheKeys.menuByCategory(category),
        ]);

        return item;
    },

    async getItemsByIds(ids: string[]) {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            throw new ApiError(400, "ids array is required");
        }

        // validate Mongo ObjectIds
        const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            throw new ApiError(400, `Invalid item ids: ${invalidIds.join(", ")}`);
        }

        const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

        const items = await menuItemRepository.findByIds(objectIds);

        logger("info", "Fetched menu items by ids", {
            requestedCount: ids.length,
            foundCount: items.length,
        });

        return items;
    },
};
