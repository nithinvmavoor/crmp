import { redisClient } from "../db/redis";
import { env } from "../config/env";
import { logger } from "@crmp/common";

export const catalogCacheService = {
    async get<T>(key: string): Promise<T | null> {
        const cached = await redisClient.get(key);
        if (!cached) return null;

        logger("info", "Menu cache hit", { cacheKey: key, cacheHit: true });
        return JSON.parse(cached) as T;
    },

    async set(key: string, value: unknown) {
        await redisClient.setEx(key, env.CACHE_TTL_SECONDS, JSON.stringify(value));
    },

    async del(keys: string[]) {
        if (!keys.length) return;

        await Promise.all(keys.map(k => redisClient.del(k)));
        logger("info", "Menu cache invalidated", { keys });
    },
};
