import { Router } from "express";
import { silentAuthMiddleware } from "@crmp/common";
import { createOrder, getOrderById } from "../controllers/order.controller";

const router = Router();

const {AUTH_SERVICE_URL, JWT_SECRET} = process.env
// All routes require JWT
router.use(silentAuthMiddleware({AUTH_SERVICE_URL, JWT_SECRET}));

router.post("/orders", createOrder);
router.get("/orders/:id", getOrderById);

export default router;
