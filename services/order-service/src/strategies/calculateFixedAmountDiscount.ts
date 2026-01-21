/**
 * Calculate fixed amount discount
 * @param originalPrice - The original price before discount
 * @param amount - The fixed amount to discount (e.g., 15 for $15 off)
 * @returns The discount amount (clamped to not exceed originalPrice)
 */
export function calculateFixedAmountDiscount(originalPrice: number, amount: number): number {
  console.log('Inside...');

  if (amount <= 0 || originalPrice <= 0) {
    return 0;
  }

  // Ensure discount doesn't exceed original price
  return Math.min(amount, originalPrice);
}
