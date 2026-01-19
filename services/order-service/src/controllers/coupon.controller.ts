import { Request, Response } from "express";
import { CouponModel } from "../models/coupon.model";
import { sendErrorResponse } from "../utils/error-response.util";
import { logger } from "../utils/logger";

//TODO: Coupon should be created against user. Should set expiry once it applied.
// Otherwise create a field usersIds to track whether the user used this coupon or not.!!!
export const createCoupon = async (req: Request, res: Response) => {
  try {
    let { code, type, value, isActive, expiresAt } = req.body;

    // basic validation
    if (!code || !type || value === undefined || value === null) {
      return sendErrorResponse(res, 400, "code, type and value are required", "VALIDATION_ERROR");
    }

    code = String(code).trim().toUpperCase();

    if (!["PERCENTAGE", "FIXED_AMOUNT"].includes(type)) {
      return sendErrorResponse(res, 400, "Invalid coupon type", "VALIDATION_ERROR");
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue) || numericValue < 0) {
      return sendErrorResponse(res, 400, "value must be a positive number", "VALIDATION_ERROR");
    }

    // percentage max rule (recommended)
    if (type === "PERCENTAGE" && numericValue > 100) {
      return sendErrorResponse(res, 400, "percentage value cannot exceed 100", "VALIDATION_ERROR");
    }

    // expiresAt optional validation
    let parsedExpiresAt: Date | undefined;
    if (expiresAt) {
      const dt = new Date(expiresAt);
      if (isNaN(dt.getTime())) {
        return sendErrorResponse(res, 400, "expiresAt is invalid date", "VALIDATION_ERROR");
      }
      parsedExpiresAt = dt;
    }

    // ensure unique code
    const existing = await CouponModel.findOne({ code }).lean();
    if (existing) {
      return sendErrorResponse(res, 409, "Coupon code already exists", "CONFLICT");
    }

    const coupon = await CouponModel.create({
      code,
      type,
      value: numericValue,
      isActive: isActive ?? true,
      expiresAt: parsedExpiresAt,
    });

    logger("info", "Coupon created", {
      couponId: coupon._id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    });

    return res.status(201).json({
      success: true,
      data: coupon,
      error: null,
    });
  } catch (err: any) {
    logger("error", "Create coupon failed", { errorMessage: err.message });
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};
