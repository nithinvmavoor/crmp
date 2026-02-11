import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { registerValidation } from "../validators/auth.validator";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.post("/register", registerValidation, validateRequest, authController.register);
router.post("/login", authController.login);
router.post("/refresh-cookie", authController.refresh);
export default router;
