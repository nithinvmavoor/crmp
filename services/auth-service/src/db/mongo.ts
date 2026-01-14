import mongoose from "mongoose";

export const connectMongo = async (mongoUri: string) => {
  await mongoose.connect(mongoUri);
  console.log(
    JSON.stringify({
      level: "info",
      service: process.env.SERVICE_NAME,
      msg: "MongoDB connected",
    })
  );
};

export const disconnectMongo = async () => {
  await mongoose.disconnect();
  console.log(
    JSON.stringify({
      level: "info",
      service: process.env.SERVICE_NAME,
      msg: "MongoDB disconnected",
      time: new Date().toISOString(),
    })
  );
};
