import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../config.env") });

import app from "./app";
import { connectMongo } from "./db/mongo";
import { connectRedis } from "./db/redis";
import { logger } from "@crmp/common";
import { OrderModel } from "./models/order.model";

const start = async () => {
  await connectMongo(process.env.MONGO_URI || "");
  console.log('Connecting to order...');

  await connectRedis();
  console.log('Connected.!!!..');
  await OrderModel.syncIndexes();
  logger("info", "Order indexes synced");

  const PORT = process.env.PORT || 4003;
  app.listen(PORT as number, "0.0.0.0", () => {
    console.log(`order-service running on ${PORT}`);
  });
};

start();
