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
  
  