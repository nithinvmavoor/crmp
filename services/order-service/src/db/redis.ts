import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

export const connectRedis = async () => {
  redisClient = createClient({
    url: process.env.REDIS_URL!,
    socket: {
      connectTimeout: 5000,
    },
  });

  redisClient.on("error", err => {
    console.error("Redis error:", err.message);
  });

  console.log("Connecting to Redis from order!!!_+++++++");
  await redisClient.connect();
  console.log("Redis connected");
};

export const getRedisClient = () => redisClient;
