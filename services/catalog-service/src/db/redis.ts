import { createClient } from "redis";
import { logger } from "@crmp/common";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

export const connectRedis = async () => {
  redisClient.on("error", (err) => {
    logger("error", "Redis error", { err: err.message });
  });

  await redisClient.connect();

  logger("info", "Redis connected");
};
