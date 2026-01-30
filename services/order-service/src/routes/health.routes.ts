import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    service: process.env.SERVICE_NAME || "order-service",
    status: "ok",
    time: new Date().toISOString()
  });
});

export default router;
