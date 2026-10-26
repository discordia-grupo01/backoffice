export const SUSPEND_USER_ERROR =
  "No pudimos suspender al usuario. Intentá de nuevo.";

const MESSAGES_BY_CODE: Record<string, string> = {
  CANNOT_SUSPEND_STAFF: "No se puede suspender a un miembro del staff.",
  FORBIDDEN: "No tenés permisos de staff para suspender usuarios.",
  USER_NOT_FOUND: "Este usuario ya no existe.",
};

/** Texto que ve el staff cuando la suspensión falla, según el `code` del back. */
export function suspendUserErrorMessage(code: string): string {
  return MESSAGES_BY_CODE[code] ?? SUSPEND_USER_ERROR;
}
