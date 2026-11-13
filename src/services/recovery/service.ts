import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type {
  RecoveryDecision,
  RecoveryRequestDetail,
  RecoveryRequestsPage,
  RecoveryRequestsQuery,
} from "@/types/recovery.types";

const BASE_PATH = "/v1/admin/recovery-requests";

function requestPath(requestId: string): string {
  return `${BASE_PATH}/${encodeURIComponent(requestId)}`;
}

const DECISION_PATH: Record<RecoveryDecision, string> = {
  approve: "approval",
  reject: "rejection",
};

export function listRecoveryRequests(
  token: string,
  { search, status, limit, offset }: RecoveryRequestsQuery,
): Promise<ApiResult<RecoveryRequestsPage>> {
  return apiRequest<RecoveryRequestsPage>(BASE_PATH, {
    token,
    params: {
      limit,
      offset,
      ...(search ? { search } : {}),
      ...(status !== "all" ? { status } : {}),
    },
  });
}

export function getRecoveryRequest(
  token: string,
  requestId: string,
): Promise<ApiResult<RecoveryRequestDetail>> {
  return apiRequest<RecoveryRequestDetail>(requestPath(requestId), { token });
}

export function resolveRecoveryRequest(
  token: string,
  requestId: string,
  decision: RecoveryDecision,
): Promise<ApiResult<RecoveryRequestDetail>> {
  return apiRequest<RecoveryRequestDetail>(
    `${requestPath(requestId)}/${DECISION_PATH[decision]}`,
    { method: "POST", token },
  );
}
