import "server-only";

import type { ApiResult } from "@/lib/apiClient";
import type { MetricsPeriod, PlatformMetrics } from "@/types/metrics.types";

import { buildMockPlatformMetrics } from "./mockPlatformMetrics";

const MOCK_LATENCY_MS = 600;

/**
 * Metricas globales del periodo. Hoy devuelve datos simulados: todavia no
 * existe el endpoint en el backend. Cuando exista, solo cambia el cuerpo de
 * esta funcion, que pasaria a pegarle al Gateway con el token de la sesion:
 *
 *   GET /v1/admin/metrics?from=YYYY-MM-DD&to=YYYY-MM-DD   (propuesta, no existe)
 *     -> 200 { period, granularity, totals, series } | 401 | 403 (sin rol de staff)
 */
export async function getPlatformMetrics(
  period: MetricsPeriod,
): Promise<ApiResult<PlatformMetrics>> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return {
    ok: true,
    status: 200,
    data: buildMockPlatformMetrics(period),
  };
}
