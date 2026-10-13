import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";
import type {
  MetricsPeriod,
  MetricsResult,
  PlatformMetrics,
} from "@/types/metrics.types";

/**
 * Llamadas del navegador hacia el BFF (`/api/metrics`, mismo origen).
 * Nunca pega directo al Gateway.
 */

interface MetricsBody {
  ok?: boolean;
  message?: string;
  metrics?: PlatformMetrics;
}

export async function getPlatformMetrics(
  period: MetricsPeriod,
): Promise<MetricsResult> {
  try {
    const { data, status } = await api.get<MetricsBody>("/metrics", {
      params: { from: period.from, to: period.to },
    });

    if (status === 200 && data.ok && data.metrics) {
      return { ok: true, metrics: data.metrics };
    }
    return {
      ok: false,
      status,
      message: data?.message ?? REQUEST_FAILED_MESSAGE,
    };
  } catch {
    return { ok: false, status: 0, message: REQUEST_FAILED_MESSAGE };
  }
}
