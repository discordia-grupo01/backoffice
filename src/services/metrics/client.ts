import type { MetricsPeriod, PlatformMetrics } from "@/types/metrics.types";

import { buildMockPlatformMetrics } from "./mockPlatformMetrics";

const MOCK_LATENCY_MS = 600;

/** El back respondió 403: la persona no tiene rol de staff. */
export class MetricsForbiddenError extends Error {
  constructor() {
    super("STAFF_REQUIRED");
    this.name = "MetricsForbiddenError";
  }
}

/**
 * Métricas globales del período. Hoy devuelve datos simulados; cuando exista
 * `GET /v1/admin/metrics` solo cambia el cuerpo de esta función.
 */
export async function getPlatformMetrics(
  period: MetricsPeriod,
): Promise<PlatformMetrics> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return buildMockPlatformMetrics(period);
}
