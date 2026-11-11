import type { MetricsPeriod } from "@/types/metrics.types";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function serverMetricsCsvFilename(
  serverName: string,
  { from, to }: MetricsPeriod,
): string {
  const server = slugify(serverName) || "servidor";
  return `metricas-${server}_${from}_${to}.csv`;
}
