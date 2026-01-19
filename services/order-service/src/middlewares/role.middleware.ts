import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { sendErrorResponse } from "@crmp/common";

export const roleMiddleware = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendErrorResponse(res, 401, "Unauthorized", "UNAUTHORIZED");
    }

    if (req.user.role !== requiredRole) {
      return sendErrorResponse(res, 403, "Forbidden", "FORBIDDEN");
    }

    next();
  };
};
