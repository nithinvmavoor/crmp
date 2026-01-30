import { createClient } from "redis";
import { logger } from "@crmp/common";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

export const connectRedis = async () => {
  try {
    redisClient.on("error", (err) => {
      console.error("Redis error event:", err.message);
    });

    console.log("Connecting to Redis at:", process.env.REDIS_URL);

    await redisClient.connect();

    console.log("Redis connected");
  } catch (err: any) {
    console.error("Redis connection failed:", err.message);
    process.exit(1);
  }
};
