import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";
import { periodToRange } from "@/utils/metricsPeriod";
import type {
  GlobalMetricsResponse,
  MetricsPeriod,
  MetricsResult,
  ServerMetricsResponse,
  ServerMetricsResult,
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

interface ServerMetricsBody {
  ok?: boolean;
  message?: string;
  metrics?: ServerMetricsResponse;
}

export async function getServerMetrics(
  serverId: string,
  period: MetricsPeriod,
): Promise<ServerMetricsResult> {
  try {
    const { data, status } = await api.get<ServerMetricsBody>(
      `/servers/${encodeURIComponent(serverId)}/metrics`,
      { params: periodToRange(period) },
    );

    if (status === 200 && data.ok && data.metrics) {
      const { active_members, messages_sent, new_members, has_activity } =
        data.metrics;
      return {
        ok: true,
        metrics: {
          period,
          active_members,
          messages_sent,
          new_members,
          has_activity,
        },
      };
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
