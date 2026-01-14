import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { SignOptions } from "jsonwebtoken";

// TODO: remove this hardcoded value
const JWT_SECRET = process.env.JWT_SECRET || ("jsdfjfjdfkjgurgnsjdnfjdfuhrsdjsdf" as string);
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "15m";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: "Email and password are required", code: "VALIDATION_ERROR" },
      });
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        data: null,
        error: { message: "Email already registered", code: "CONFLICT" },
      });
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
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: "Internal server error", code: "INTERNAL_ERROR" },
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { message: "Email and password are required", code: "VALIDATION_ERROR" },
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { message: "Invalid credentials", code: "UNAUTHORIZED" },
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { message: "Invalid credentials", code: "UNAUTHORIZED" },
      });
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
    console.log(err);

    return res.status(500).json({
      success: false,
      data: null,
      error: { message: "Internal server error", code: "INTERNAL_ERROR" },
    });
  }
};
