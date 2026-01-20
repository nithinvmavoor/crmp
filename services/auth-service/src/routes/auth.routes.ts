import { Router } from "express";
import { register, login, refreshFromCookie } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
// ✅ backend silent refresh support
router.post("/refresh-cookie", refreshFromCookie);
export default router;
