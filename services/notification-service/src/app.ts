import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";
import notifyRoutes from "./routes/notify.routes";
import { activityMiddleware } from "@crmp/common";

const app = express();

const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow curl/postman (no origin)
      if (!origin) return callback(null, true);

      if (corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(activityMiddleware);

app.use(helmet());
app.use(express.json());

app.use((req, _res, next) => {
  console.log("DEBUG REQUEST:", {
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path,
    url: req.url,
  });
  next();
});

console.log("Path check!!!!!!!!");

app.use("/notifications/health", healthRoutes);
app.use("/notifications", notifyRoutes);

export default app;
