import { createClient } from "redis";
import { logger } from "../utils/logger";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

// ✅ separate connection for worker blocking commands
export const workerRedisClient = createClient({
  url: process.env.REDIS_URL,
});

export const connectRedis = async () => {
  const attachEvents = (client: any, name: string) => {
    client.on("error", (err: any) => {
      logger("error", `${name} Redis error`, { errorMessage: err.message });
    });
    client.on("connect", () => logger("info", `${name} Redis connect event`));
    client.on("ready", () => logger("info", `${name} Redis ready event`));
    client.on("reconnecting", () => logger("warn", `${name} Redis reconnecting`));
  };

  attachEvents(redisClient, "API");
  attachEvents(workerRedisClient, "WORKER");

  await redisClient.connect();
  await workerRedisClient.connect();

  logger("info", "Redis connected (API + WORKER clients)");
};
