import { Router } from "express";
import { getItems, createItem } from "../controllers/catalog.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// All routes require JWT
router.use(authMiddleware);

router.get("/items", getItems);
router.post("/items", roleMiddleware("ADMIN"), createItem);

export default router;
