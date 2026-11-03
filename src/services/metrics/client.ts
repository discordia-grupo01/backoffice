import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";
import { periodToRange } from "@/utils/metricsPeriod";
import type {
  GlobalMetricsResponse,
  MetricsPeriod,
  MetricsResult,
} from "@/types/metrics.types";

import { toPlatformMetrics } from "./mapPlatformMetrics";

interface MetricsBody {
  ok?: boolean;
  message?: string;
  metrics?: GlobalMetricsResponse;
}

export async function getPlatformMetrics(
  period: MetricsPeriod,
): Promise<MetricsResult> {
  try {
    const { data, status } = await api.get<MetricsBody>("/metrics", {
      params: periodToRange(period),
    });

    if (status === 200 && data.ok && data.metrics) {
      return { ok: true, metrics: toPlatformMetrics(period, data.metrics) };
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
