import { ROUTES } from "@/lib/constants";

export const RECOVERY_REQUEST_PARAM = "solicitud";

export function recoveryRequestHref(requestId: string): string {
  return `${ROUTES.recoveryRequests}?${RECOVERY_REQUEST_PARAM}=${encodeURIComponent(requestId)}`;
}
