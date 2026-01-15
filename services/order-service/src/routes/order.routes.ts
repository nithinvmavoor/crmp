import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createOrder, getOrderById } from "../controllers/order.controller";

const router = Router();

router.use(authMiddleware);

router.post("/orders", createOrder);
router.get("/orders/:id", getOrderById);

export default router;
