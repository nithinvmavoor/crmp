import { Response, NextFunction } from "express";
import { sendErrorResponse } from "../utils/response.util";
import { AuthRequest } from "./auth.middleware";
import { ApiError } from "../errors/ApiError";

export const roleMiddleware = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    console.log(req.user);

    if (req.user.role !== requiredRole) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  };
};
