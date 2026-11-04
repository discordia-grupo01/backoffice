import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";
import type {
  IncidentActionResult,
  IncidentInput,
  PlatformStatusResponse,
  StatusResult,
} from "@/types/status.types";

interface StatusBody {
  ok?: boolean;
  message?: string;
  data?: PlatformStatusResponse;
}

export async function getPlatformStatus(): Promise<StatusResult> {
  try {
    const { data, status } = await api.get<StatusBody>("/status");
    if (status === 200 && data.ok && data.data) {
      return { ok: true, data: data.data };
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

async function sendAction(
  url: string,
  body?: unknown,
): Promise<IncidentActionResult> {
  try {
    const { data, status } = await api.post<{
      ok?: boolean;
      message?: string;
    }>(url, body);
    if (status >= 200 && status < 300 && data.ok) return { ok: true };
    return {
      ok: false,
      status,
      message: data?.message ?? REQUEST_FAILED_MESSAGE,
    };
  } catch {
    return { ok: false, status: 0, message: REQUEST_FAILED_MESSAGE };
  }
}

export function createIncident(
  input: IncidentInput,
): Promise<IncidentActionResult> {
  return sendAction("/incidents", input);
}

export function resolveIncident(
  incidentId: string,
): Promise<IncidentActionResult> {
  return sendAction(`/incidents/${encodeURIComponent(incidentId)}/resolve`);
}
