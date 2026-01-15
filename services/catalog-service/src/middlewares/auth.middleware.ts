import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../utils/error-response.util";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return sendErrorResponse(res, 401, "Missing token", "UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log(JWT_SECRET);

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return sendErrorResponse(res, 401, "Invalid token", "UNAUTHORIZED");
  }
};
