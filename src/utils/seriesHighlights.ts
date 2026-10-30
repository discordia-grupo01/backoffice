export interface SeriesHighlights {
  peak: { date: string; value: number };
  average: number;
}

/** Punto máximo y promedio de una serie temporal; `null` si todo es cero. */
export function seriesHighlights<T extends { date: string }>(
  data: readonly T[],
  key: Extract<keyof T, string>,
): SeriesHighlights | null {
  let peak: SeriesHighlights["peak"] | null = null;
  let sum = 0;

  for (const point of data) {
    const value = Number(point[key]) || 0;
    sum += value;
    if (!peak || value > peak.value) peak = { date: point.date, value };
  }

  if (!peak || peak.value === 0) return null;
  return { peak, average: sum / data.length };
}
