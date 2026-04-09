/**
 * Format an amount in Moroccan Dirhams.
 * Output: "1 180 Dh"  (space thousands separator, fr-MA locale)
 */
export function formatMad(amount) {
  const n = Math.round(amount);
  return `${n.toLocaleString("fr-MA", { maximumFractionDigits: 0 })} Dh`;
}