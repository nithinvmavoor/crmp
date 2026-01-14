import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const roleMiddleware = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        data: null,
        error: { message: "Forbidden", code: "FORBIDDEN" },
      });
    }

    next();
  };
};
