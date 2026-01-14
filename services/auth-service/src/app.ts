import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRoutes);
app.use("/", authRoutes); // /register & /login

app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: { message: "Page not found", code: "NOT_FOUND" },
  });
});
export default app;
