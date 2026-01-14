import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import { sendErrorResponse } from "./utils/error-response.util";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRoutes);
app.use("/", authRoutes); // /register & /login

app.use((req, res) => {
  sendErrorResponse(res, 404, "Page not found", "NOT_FOUND");
});
export default app;
