import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";
import { writeActivityLog } from "../utils/activityLogger";

export const activityMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;

    writeActivityLog({
      time: new Date().toISOString(),
      service: process.env.SERVICE_NAME || "unknown-service",
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      ip: req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "",
      userAgent: req.headers["user-agent"] || "",
      user: {
        userId: req.user?.userId,
        email: req.user?.email,
        role: req.user?.role,
      },
    });
  });

  next();
};
