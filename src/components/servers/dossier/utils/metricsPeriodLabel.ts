import { formatDate } from "@/utils/formatDate";
import { parseIsoDate } from "@/utils/metricsPeriod";
import type { MetricsPeriod } from "@/types/metrics.types";

function formatDay(isoDate: string): string {
  return formatDate(parseIsoDate(isoDate).toISOString());
}

export function periodLabel({ from, to }: MetricsPeriod): string {
  if (from === to) return `El ${formatDay(from)}`;
  return `Del ${formatDay(from)} al ${formatDay(to)}`;
}
