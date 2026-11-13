import type { RecoveryRequest, StaffRef } from "@/types/recovery.types";
import { formatDateTime } from "@/utils/formatDate";

export const UNKNOWN_USER_NAME = "Usuario desconocido";
const UNKNOWN_STAFF_NAME = "un miembro del staff";

export function requesterName(request: Pick<RecoveryRequest, "user">): string {
  return request.user?.name ?? UNKNOWN_USER_NAME;
}

/** "Aprobada por Beto el 13/11/2026 14:05"; `null` mientras esté pendiente. */
export function resolutionText(request: {
  status: RecoveryRequest["status"];
  resolved_at: string | null;
  resolved_by: StaffRef | null;
}): string | null {
  if (request.status === "pending" || !request.resolved_at) return null;
  const verb = request.status === "approved" ? "Aprobada" : "Rechazada";
  const staff = request.resolved_by?.name ?? UNKNOWN_STAFF_NAME;
  return `${verb} por ${staff} el ${formatDateTime(request.resolved_at)}`;
}

const NO_PREVIOUS_REQUESTS = "Ninguna";

function rejectedLabel(rejected: number): string {
  const isSingular = rejected === 1;
  return `${rejected} ${isSingular ? "rechazada" : "rechazadas"}`;
}

export function previousRequestsText({
  total,
  rejected,
}: {
  total: number;
  rejected: number;
}): string {
  const hasPreviousRequests = total > 0;
  const hasRejected = rejected > 0;

  if (!hasPreviousRequests) return NO_PREVIOUS_REQUESTS;
  if (!hasRejected) return String(total);
  return `${total} (${rejectedLabel(rejected)})`;
}
