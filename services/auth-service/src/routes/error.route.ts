import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    service: process.env.SERVICE_NAME || "auth-service",
    status: "ok",
    time: new Date().toISOString(),
  });
});

export default router;
