import { Router } from "express";
import { createCoupon } from "../controllers/coupon.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// JWT required
router.use(authMiddleware);

// ADMIN only
router.post("/", roleMiddleware("ADMIN"), createCoupon);

export default router;
