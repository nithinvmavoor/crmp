import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { enqueueNotification } from "../controllers/notify.controller";

const router = Router();

router.use(authMiddleware);

router.post("/notify", enqueueNotification);

export default router;
