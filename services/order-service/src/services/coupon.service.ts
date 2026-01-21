import { couponRepository } from "../repositories/coupon.repository";
import { ApiError, logger } from "@crmp/common";

export const couponService = {
    async createCoupon(body: any) {
        let { code, type, value, isActive, expiresAt } = body;

        if (!code || !type || value === undefined || value === null) {
            throw new ApiError(400, "code, type and value are required");
        }

        code = String(code).trim().toUpperCase();

        if (!["PERCENTAGE", "FIXED_AMOUNT"].includes(type)) {
            throw new ApiError(400, "Invalid coupon type");
        }

        const numericValue = Number(value);
        if (Number.isNaN(numericValue) || numericValue < 0) {
            throw new ApiError(400, "value must be a positive number");
        }

        if (type === "PERCENTAGE" && numericValue > 100) {
            throw new ApiError(400, "percentage value cannot exceed 100");
        }

        let parsedExpiresAt: Date | undefined;
        if (expiresAt) {
            const dt = new Date(expiresAt);
            if (isNaN(dt.getTime())) throw new ApiError(400, "expiresAt is invalid date");
            parsedExpiresAt = dt;
        }

        const existing = await couponRepository.findByCode(code);
        if (existing) throw new ApiError(409, "Coupon code already exists");

        const coupon = await couponRepository.create({
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

        return coupon;
    },
};
