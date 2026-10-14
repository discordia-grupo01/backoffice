import { addDays, parseIsoDate, toIsoDate } from "@/utils/metricsPeriod";
import type {
  MetricsPeriod,
  MetricsSeriesPoint,
  MetricsTotals,
  PlatformMetrics,
} from "@/types/metrics.types";

/** Antes de esta fecha la plataforma no tenía actividad: sirve para probar el estado vacío. */
export const MOCK_LAUNCH_DATE = "2026-01-01";

/** Número pseudoaleatorio estable en [0, 1) para una semilla de texto. */
function seeded(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

function dailyPoint(date: string): MetricsSeriesPoint {
  if (date < MOCK_LAUNCH_DATE) {
    return { date, active_users: 0, servers_created: 0, messages_sent: 0 };
  }
  return {
    date,
    active_users: Math.round(90_000 + seeded(`u${date}`) * 80_000),
    servers_created: Math.round(380 + seeded(`s${date}`) * 220),
    messages_sent: Math.round(5_500_000 + seeded(`m${date}`) * 3_000_000),
  };
}

function hourlyPoint(date: string, hour: number): MetricsSeriesPoint {
  const key = `${date}T${String(hour).padStart(2, "0")}:00`;
  const daytime = Math.sin(((hour - 5) / 24) * Math.PI) ** 2;
  const factor = 0.15 + daytime * 0.85;
  return {
    date: key,
    active_users: Math.round((3_000 + seeded(`u${key}`) * 2_000) * factor * 2),
    servers_created: Math.round((8 + seeded(`s${key}`) * 12) * factor),
    messages_sent: Math.round(
      (150_000 + seeded(`m${key}`) * 100_000) * factor * 2,
    ),
  };
}

function buildTotals(series: MetricsSeriesPoint[]): MetricsTotals {
  const sum = (pick: (point: MetricsSeriesPoint) => number) =>
    series.reduce((total, point) => total + pick(point), 0);
  const peakUsers = Math.max(0, ...series.map((point) => point.active_users));

  return {
    // Una persona activa varios días cuenta una vez: el total sale de los únicos, no de sumar días.
    active_users: Math.round(peakUsers * (series.length > 1 ? 1.4 : 1)),
    servers_created: sum((point) => point.servers_created),
    messages_sent: sum((point) => point.messages_sent),
  };
}

/** Respuesta simulada de `GET /v1/admin/metrics`, con la forma del contrato propuesto. */
export function buildMockPlatformMetrics(
  period: MetricsPeriod,
  now: Date = new Date(),
): PlatformMetrics {
  const isSingleDay = period.from === period.to;

  let series: MetricsSeriesPoint[] = [];
  if (isSingleDay) {
    const isToday = period.to === toIsoDate(now);
    const lastHour = isToday ? now.getHours() : 23;
    series = Array.from({ length: lastHour + 1 }, (_, hour) =>
      period.from < MOCK_LAUNCH_DATE
        ? {
            date: `${period.from}T${String(hour).padStart(2, "0")}:00`,
            active_users: 0,
            servers_created: 0,
            messages_sent: 0,
          }
        : hourlyPoint(period.from, hour),
    );
  } else {
    const start = parseIsoDate(period.from);
    const days =
      Math.round(
        (parseIsoDate(period.to).getTime() - start.getTime()) / 86_400_000,
      ) + 1;
    series = Array.from({ length: days }, (_, index) =>
      dailyPoint(toIsoDate(addDays(start, index))),
    );
  }

  return {
    period,
    granularity: isSingleDay ? "hour" : "day",
    totals: buildTotals(series),
    series,
  };
}
