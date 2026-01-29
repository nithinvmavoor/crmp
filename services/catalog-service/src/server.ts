/* import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../catalog-config.env") }); */

import app from "./app";
import { connectMongo } from "./db/mongo";
import { connectRedis } from "./db/redis";
import { logger } from "@crmp/common";

const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI || "";

const start = async () => {
  console.log("Inside catalog server!!!!!!");

  await connectMongo(MONGO_URI);
  await connectRedis();
  app.listen(PORT as number, "0.0.0.0", () => {
    console.log(`${process.env.SERVICE_NAME} running on ${PORT}`);
  });
};

start();
