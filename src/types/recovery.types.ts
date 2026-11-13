import type { PlatformUser } from "./users.types";

export type RecoveryRequestStatus = "pending" | "approved" | "rejected";

export type RecoveryStatusFilter = "all" | RecoveryRequestStatus;

export type RecoveryDecision = "approve" | "reject";

export interface StaffRef {
  id: string;
  name: string | null;
}

export interface RecoveryRequest {
  id: string;
  user: PlatformUser | null;
  user_id: string;
  message: string;
  status: RecoveryRequestStatus;
  requested_at: string;
  resolved_at: string | null;
  resolved_by: StaffRef | null;
}

export interface RecoveryRequestDetail extends RecoveryRequest {
  previous_requests: { total: number; rejected: number };
}

export interface RecoveryRequestsQuery {
  search: string;
  status: RecoveryStatusFilter;
  limit: number;
  offset: number;
}

export interface RecoveryRequestsPage {
  requests: RecoveryRequest[];
  total: number;
  limit: number;
  offset: number;
}

export type RecoveryRequestsResult =
  | { ok: true; page: RecoveryRequestsPage }
  | { ok: false; status: number; message: string };

export type RecoveryRequestResult =
  | { ok: true; request: RecoveryRequestDetail }
  | { ok: false; status: number; code: string; message: string };
