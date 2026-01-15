import mongoose, { Schema, Document } from "mongoose";

export type CouponType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number; // percentage (0-100) for PERCENTAGE, or amount for FIXED_AMOUNT
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      enum: ["PERCENTAGE", "FIXED_AMOUNT"],
      required: true,
    },
    value: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { versionKey: false }
);

CouponSchema.index({ code: 1 });

export const CouponModel = mongoose.model<ICoupon>("Coupon", CouponSchema);
