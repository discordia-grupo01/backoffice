import { parseIsoDate } from "@/utils/metricsPeriod";
import type { MetricsGranularity } from "@/types/metrics.types";

const integerFormat = new Intl.NumberFormat("es-AR");
const compactFormat = new Intl.NumberFormat("es-AR", { notation: "compact" });

export function formatInteger(value: number): string {
  return integerFormat.format(value);
}

export function formatCompact(value: number): string {
  return compactFormat.format(value);
}

export const METRIC_COMPACT_FROM = 1_000_000_000;

export function formatMetricValue(value: number): {
  display: string;
  exact: string | null;
} {
  if (value < METRIC_COMPACT_FROM) {
    return { display: formatInteger(value), exact: null };
  }
  return { display: formatCompact(value), exact: formatInteger(value) };
}

/** Etiqueta corta de un punto de la serie para el eje X. */
export function formatSeriesLabel(
  date: string,
  granularity: MetricsGranularity,
  pointCount: number,
): string {
  if (granularity === "hour") return `${date.slice(11, 13)}h`;

  const day = parseIsoDate(date);
  if (pointCount <= 7) {
    const weekday = day.toLocaleDateString("es-AR", { weekday: "short" });
    return weekday.replace(".", "");
  }
  return `${String(day.getDate()).padStart(2, "0")}/${String(day.getMonth() + 1).padStart(2, "0")}`;
}

/** Etiqueta larga para el tooltip. */
export function formatSeriesTooltipLabel(
  date: string,
  granularity: MetricsGranularity,
): string {
  if (granularity === "hour") return `${date.slice(11, 13)}:00 h`;
  return parseIsoDate(date).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
