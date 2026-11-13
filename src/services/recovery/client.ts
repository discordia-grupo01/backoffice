import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";
import type {
  RecoveryDecision,
  RecoveryRequestDetail,
  RecoveryRequestResult,
  RecoveryRequestsPage,
  RecoveryRequestsQuery,
  RecoveryRequestsResult,
} from "@/types/recovery.types";

interface PageBody {
  ok?: boolean;
  message?: string;
  page?: RecoveryRequestsPage;
}

export async function getRecoveryRequests(
  query: RecoveryRequestsQuery,
): Promise<RecoveryRequestsResult> {
  try {
    const { data, status } = await api.get<PageBody>("/recovery-requests", {
      params: query,
    });
    if (status === 200 && data.ok && data.page) {
      return { ok: true, page: data.page };
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

interface RequestBody {
  ok?: boolean;
  code?: string;
  message?: string;
  request?: RecoveryRequestDetail;
}

async function send(
  method: "get" | "post",
  url: string,
): Promise<RecoveryRequestResult> {
  try {
    const { data, status } = await api.request<RequestBody>({ method, url });
    if (status === 200 && data.ok && data.request) {
      return { ok: true, request: data.request };
    }
    return {
      ok: false,
      status,
      code: data?.code ?? "UNKNOWN_ERROR",
      message: data?.message ?? REQUEST_FAILED_MESSAGE,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      code: "NETWORK_ERROR",
      message: REQUEST_FAILED_MESSAGE,
    };
  }
}

function requestUrl(requestId: string): string {
  return `/recovery-requests/${encodeURIComponent(requestId)}`;
}

export function getRecoveryRequest(
  requestId: string,
): Promise<RecoveryRequestResult> {
  return send("get", requestUrl(requestId));
}

export function decideRecoveryRequest(
  requestId: string,
  decision: RecoveryDecision,
): Promise<RecoveryRequestResult> {
  return send("post", `${requestUrl(requestId)}/${decision}`);
}
