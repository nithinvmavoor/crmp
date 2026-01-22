import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";
import catalogRoutes from "./routes/catalog.routes";
import { activityMiddleware, sendErrorResponse } from "@crmp/common";

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
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRoutes);
app.use("/", catalogRoutes);

app.use((req, res) => {
  sendErrorResponse(res, 404, "Page not found", "NOT_FOUND");
});

export default app;
