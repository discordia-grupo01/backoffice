import { toIsoDate } from "@/utils/metricsPeriod";
import type {
  GlobalMetricsResponse,
  MetricsGranularity,
  MetricsPeriod,
  PlatformMetrics,
} from "@/types/metrics.types";

function toSeriesDate(start: string, granularity: MetricsGranularity): string {
  const date = new Date(start);
  if (granularity === "day") return toIsoDate(date);
  return `${toIsoDate(date)}T${String(date.getHours()).padStart(2, "0")}:00`;
}

export function toPlatformMetrics(
  period: MetricsPeriod,
  response: GlobalMetricsResponse,
): PlatformMetrics {
  return {
    period,
    granularity: response.granularity,
    totals: {
      active_users: response.active_users,
      servers_created: response.servers_created,
      messages_sent: response.messages_sent,
    },
    series: response.series.map(({ start, ...counts }) => ({
      date: toSeriesDate(start, response.granularity),
      ...counts,
    })),
    has_activity: response.has_activity,
  };
}
