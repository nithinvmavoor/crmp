import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

export const connectRedis = async () => {
  redisClient.on("error", (err) => {
    console.log(
      JSON.stringify({
        level: "error",
        msg: "Redis error",
        err: err.message,
        service: process.env.SERVICE_NAME,
      })
    );
  });

  await redisClient.connect();

  console.log(
    JSON.stringify({ level: "info", msg: "Redis connected", service: process.env.SERVICE_NAME })
  );
};
