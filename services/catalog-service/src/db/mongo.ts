import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectMongo = async (mongoUri: string) => {
  await mongoose.connect(mongoUri);
  logger("info", "MongoDB connected");
};

export const disconnectMongo = async () => {
  await mongoose.disconnect();
  logger("info", "MongoDB disconnected", { time: new Date().toISOString() });
};
