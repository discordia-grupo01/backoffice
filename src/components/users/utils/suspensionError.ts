import type { SuspensionAction } from "@/types/users.types";

const GENERIC_ERROR: Record<SuspensionAction, string> = {
  suspend: "No pudimos suspender al usuario. Intentá de nuevo.",
  reactivate: "No pudimos reactivar al usuario. Intentá de nuevo.",
};

const FORBIDDEN_ERROR: Record<SuspensionAction, string> = {
  suspend: "No tenés permisos de staff para suspender usuarios.",
  reactivate: "No tenés permisos de staff para reactivar usuarios.",
};

/** Texto que ve el staff cuando suspender o reactivar falla, según el `code` del back. */
export function suspensionErrorMessage(
  action: SuspensionAction,
  code: string,
): string {
  switch (code) {
    case "FORBIDDEN":
      return FORBIDDEN_ERROR[action];
    case "CANNOT_SUSPEND_STAFF":
      return "No se puede suspender a un miembro del staff.";
    case "USER_NOT_FOUND":
      return "Este usuario ya no existe.";
    default:
      return GENERIC_ERROR[action];
  }
}
