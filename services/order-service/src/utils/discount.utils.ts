import { CouponType, ICoupon } from "../models/coupon.model";

/**
 * Calculate percentage-based discount
 * @param originalPrice - The original price before discount
 * @param percentage - The percentage to discount (e.g., 10 for 10%)
 * @returns The discount amount (clamped to not exceed originalPrice)
 */
export function calculatePercentageDiscount(originalPrice: number, percentage: number): number {
  if (percentage <= 0 || percentage > 100 || originalPrice <= 0) {
    return 0;
  }

  const discountAmount = (originalPrice * percentage) / 100;
  // Ensure discount doesn't exceed original price
  return Math.min(discountAmount, originalPrice);
}

/**
 * Calculate fixed amount discount
 * @param originalPrice - The original price before discount
 * @param amount - The fixed amount to discount (e.g., 15 for $15 off)
 * @returns The discount amount (clamped to not exceed originalPrice)
 */
export function calculateFixedAmountDiscount(originalPrice: number, amount: number): number {
  if (amount <= 0 || originalPrice <= 0) {
    return 0;
  }

  // Ensure discount doesn't exceed original price
  return Math.min(amount, originalPrice);
}

/**
 * No discount - returns 0
 * @returns Always returns 0
 */
export function calculateNoDiscount(): number {
  return 0;
}

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
