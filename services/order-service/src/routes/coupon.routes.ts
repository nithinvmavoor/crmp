import { Router } from "express";
import { createCoupon } from "../controllers/coupon.controller";
import { silentAuthMiddleware, roleMiddleware } from "@crmp/common";

const router = Router();

const {AUTH_SERVICE_URL, JWT_SECRET} = process.env
// All routes require JWT
router.use(silentAuthMiddleware({AUTH_SERVICE_URL, JWT_SECRET}));

// ADMIN only
router.post("/", roleMiddleware("ADMIN"), createCoupon);

export default router;
