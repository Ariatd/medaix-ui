/**
 * Helpers to normalize and format confidence values which may be stored
 * either as fractions (0.85), percentages (85), or scaled values (8500).
 */

export function toPercent(raw?: number | null): number | null {
  if (raw === undefined || raw === null || Number.isNaN(raw)) return null;

  let v = Number(raw);

  // If value is fraction (<= 1), convert to percent
  if (v <= 1) return v * 100;

  // If value is already a reasonable percent (<= 100), return as-is
  if (v <= 100) return v;

  // If value is greater than 100 (e.g. 8500), repeatedly divide by 100
  // until value is <= 100, then use that as percent (8500 -> 85)
  while (v > 100) {
    v = v / 100;
  }

  return v;
}

export function formatPercent(raw?: number | null, round = true): string {
  const p = toPercent(raw);
  if (p === null) return 'N/A';
  return `${round ? Math.round(p) : +p.toFixed(2)}%`;
}
