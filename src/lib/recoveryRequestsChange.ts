import type { ChangeFilter } from "@discordia/client-shared";

import { changeBus } from "@/lib/changeBus";

export const RECOVERY_REQUESTS_CHANGE: ChangeFilter = {
  resources: ["backoffice"],
  kinds: ["recovery_requests"],
};

// Después de aprobar o rechazar se avisa desde el navegador para que el
// contador y el listado no esperen al aviso del socket.
export function publishRecoveryRequestsChange(): void {
  changeBus.publish({ resource: "backoffice", kind: "recovery_requests" });
}
