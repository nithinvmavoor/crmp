import { Router } from "express";
import { getItems, createItem, getItemsByIds } from "../controllers/catalog.controller";
import { silentAuthMiddleware, roleMiddleware } from "@crmp/common";

const router = Router();
const {AUTH_SERVICE_URL, JWT_SECRET} = process.env
// All routes require JWT
router.use(silentAuthMiddleware({AUTH_SERVICE_URL, JWT_SECRET}));

router.get("/items", getItems);
router.post("/items", roleMiddleware("ADMIN"), createItem);

router.post("/items/by-ids", getItemsByIds);

export default router;
