import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
  console.log(
    JSON.stringify({
      level: "info",
      service: process.env.SERVICE_NAME || "auth-service",
      msg: `Service started`,
      port: PORT,
      time: new Date().toISOString()
    })
  );
});
