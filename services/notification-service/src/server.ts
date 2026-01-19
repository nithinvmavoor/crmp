import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../config.env") });

import app from "./app";
import { connectRedis } from "./db/redis";
import { logger } from "@crmp/common";
import { startNotificationWorker } from "./workers/notification.worker";

const PORT = process.env.PORT || 4004;

const start = async () => {
  await connectRedis();

  app.listen(PORT, () => {
    logger("info", "Service started", { port: PORT });
  });

  // Start background worker
  startNotificationWorker();
};

start();
