import { Router } from "express";
import { catalogController } from "../controllers/catalog.controller";
import { silentAuthMiddleware, roleMiddleware } from "@crmp/common";

const router = Router();
const { AUTH_SERVICE_URL, JWT_SECRET } = process.env

// All routes require JWT
router.use(silentAuthMiddleware({ AUTH_SERVICE_URL, JWT_SECRET }));

router.get("/items", catalogController.getItems);
router.post("/items", roleMiddleware("ADMIN"), catalogController.createItem);
router.post("/items/by-ids", catalogController.getItemsByIds);

export default router;
