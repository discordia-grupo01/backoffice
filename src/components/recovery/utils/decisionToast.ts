import type {
  RecoveryDecision,
  RecoveryRequestResult,
} from "@/types/recovery.types";

export type ToastTone = "success" | "warning" | "danger";

export interface ToastMessage {
  tone: ToastTone;
  message: string;
}

const DONE: Record<RecoveryDecision, string> = {
  approve: "Solicitud aprobada",
  reject: "Solicitud rechazada",
};

const FAILED: Record<RecoveryDecision, string> = {
  approve: "No pudimos aprobar la solicitud. Intentá de nuevo.",
  reject: "No pudimos rechazar la solicitud. Intentá de nuevo.",
};

export const ALREADY_RESOLVED_MESSAGE =
  "Esta solicitud ya fue resuelta por otro miembro del staff";

export function decisionToast(
  decision: RecoveryDecision,
  result: RecoveryRequestResult,
): ToastMessage {
  if (result.ok) return { tone: "success", message: DONE[decision] };

  switch (result.status) {
    case 409:
      return { tone: "warning", message: ALREADY_RESOLVED_MESSAGE };
    case 404:
      return { tone: "danger", message: "Esta solicitud ya no existe." };
    case 403:
      return {
        tone: "danger",
        message: "No tenés permisos de staff para resolver solicitudes.",
      };
    default:
      return { tone: "danger", message: FAILED[decision] };
  }
}
