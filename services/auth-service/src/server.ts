import path from "path";
import dotenv from "dotenv";

import app from "./app";
import { connectMongo } from "./db/mongo";

dotenv.config({ path: path.resolve(__dirname, "../config.env") });
const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || "";

const start = async () => {
  await connectMongo(MONGO_URI);

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
