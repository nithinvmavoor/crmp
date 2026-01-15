import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../catalog-config.env") });

import app from "./app";
import { connectMongo } from "./db/mongo";
import { connectRedis } from "./db/redis";

const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI || "";

const start = async () => {
  await connectMongo(MONGO_URI);
  await connectRedis();
  app.listen(PORT, () => {
    console.log(
      JSON.stringify({
        level: "info",
        service: process.env.SERVICE_NAME,
        msg: "Service started",
        port: PORT,
      })
    );
  });
};

start();
