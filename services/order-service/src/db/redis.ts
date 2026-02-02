import { createClient, RedisClientType } from "redis";

export let redisClient: RedisClientType;

export const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL!;
    const isProduction = process.env.NODE_ENV === "production";

    const options: any = {
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
      },
    };

    // Enable TLS ONLY in production
    if (isProduction) {
      options.socket.tls = true;

      // Some managed Redis providers require this
      options.socket.rejectUnauthorized = false;
    }

    redisClient = createClient(options);

    redisClient.on("error", (err) => {
      console.error("Redis error:", err.message);
    });

    redisClient.on("connect", () => {
      console.log("Redis connected successfully");
    });

    redisClient.on("reconnecting", () => {
      console.warn("Redis reconnecting...");
    });
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err: any) {
    console.error("Redis connection failed:", err.message);
    process.exit(1);
  }
};
