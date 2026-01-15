import { Router } from "express";
import { getItems, createItem, getItemsByIds } from "../controllers/catalog.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// All routes require JWT
router.use(authMiddleware);

router.get("/items", getItems);
router.post("/items", roleMiddleware("ADMIN"), createItem);

router.post("/items/by-ids", getItemsByIds);

export default router;
