import { Router } from "express";
import { silentAuthMiddleware } from "@crmp/common";
import { enqueueNotification } from "../controllers/notify.controller";

const router = Router();

const {AUTH_SERVICE_URL, JWT_SECRET} = process.env
// All routes require JWT
router.use(silentAuthMiddleware({AUTH_SERVICE_URL, JWT_SECRET}));

router.post("/notify", enqueueNotification);

export default router;
