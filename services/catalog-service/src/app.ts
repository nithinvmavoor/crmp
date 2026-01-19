import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";
import catalogRoutes from "./routes/catalog.routes";
import { sendErrorResponse } from "@crmp/common";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRoutes);
app.use("/", catalogRoutes);

app.use((req, res) => {
  sendErrorResponse(res, 404, "Page not found", "NOT_FOUND");
});

export default app;
