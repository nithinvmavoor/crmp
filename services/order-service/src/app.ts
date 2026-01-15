import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";
import orderRoutes from "./routes/order.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/", orderRoutes);

export default app;
