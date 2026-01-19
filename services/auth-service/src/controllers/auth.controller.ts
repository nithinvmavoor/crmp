import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { SignOptions } from "jsonwebtoken";
import { sendErrorResponse } from "@crmp/common";

// TODO: remove this hardcoded value
const JWT_SECRET = process.env.JWT_SECRET || ("jsdfjfjdfkjgurgnsjdnfjdfuhrsdjsdf" as string);
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "15m";

export const register = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return sendErrorResponse(res, 400, "Request body is missing", "VALIDATION_ERROR");
    }
    const { email, password } = req.body;

    if (!email || !password) {
      return sendErrorResponse(res, 400, "Email and password are required", "VALIDATION_ERROR");
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return sendErrorResponse(res, 409, "Email already registered", "CONFLICT");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      email,
      passwordHash,
      role: "CUSTOMER", // default role
    });

    return res.status(201).json({
      success: true,
      data: { id: user._id, email: user.email, role: user.role },
      error: null,
    });
  } catch (err) {
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return sendErrorResponse(res, 400, "Request body is missing", "VALIDATION_ERROR");
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return sendErrorResponse(res, 400, "Email and password are required", "VALIDATION_ERROR");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 401, "Invalid credentials", "UNAUTHORIZED");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return sendErrorResponse(res, 401, "Invalid credentials", "UNAUTHORIZED");
    }

    const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({
      success: true,
      data: { token, expiresIn: JWT_EXPIRES_IN },
      error: null,
    });
  } catch (err) {
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};
