/**
 * Format a number as Ghana Cedis (GH₵).
 * Example: formatPrice(120) => "GH₵120.00"
 */
export function formatPrice(amount: number): string {
  return `GH₵${amount.toFixed(2)}`;
}
