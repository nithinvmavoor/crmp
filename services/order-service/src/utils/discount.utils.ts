import { CouponType, ICoupon } from "../models/coupon.model";
import { calculateFixedAmountDiscount } from "../strategies/calculateFixedAmountDiscount";
import { calculatePercentageDiscount } from "../strategies/calculatePercentageDiscount";

/**
 * Map of coupon types to their corresponding discount calculation functions
 */
const discountStrategies: Record<CouponType, (originalPrice: number, value: number) => number> = {
  PERCENTAGE: calculatePercentageDiscount,
  FIXED_AMOUNT: calculateFixedAmountDiscount,
};

/**
 * Select and execute the appropriate discount calculation strategy based on coupon type
 * @param originalPrice - The original price before discount
 * @param coupon - The coupon object (can be null/undefined if no coupon)
 * @returns The discount amount (guaranteed to not exceed originalPrice)
 */
export function calculateDiscount(
  originalPrice: number,
  coupon: ICoupon | null | undefined
): number {
  // If no coupon provided, return 0 discount
  if (!coupon || !coupon.isActive) {
    console.log("inactive coupon");
    return 0;
  }

  // Check if coupon has expired
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    console.log("expired coupon");
    return 0;
  }

  // Select strategy based on coupon type using map
  const strategy = discountStrategies[coupon.type];
  if (!strategy) {
    return 0;
  }

  return strategy(originalPrice, coupon.value);
}
