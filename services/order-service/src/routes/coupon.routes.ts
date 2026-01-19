import { Router } from "express";
import { createCoupon } from "../controllers/coupon.controller";
import { authMiddleware, roleMiddleware } from "@crmp/common";

const router = Router();

// JWT required
router.use(authMiddleware);

// ADMIN only
router.post("/", roleMiddleware("ADMIN"), createCoupon);

export default router;
