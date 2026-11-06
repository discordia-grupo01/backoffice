import type { ServerSuspensionAction } from "@/types/servers.types";

const GENERIC_ERROR: Record<ServerSuspensionAction, string> = {
  suspend: "No pudimos suspender el servidor. Intentá de nuevo.",
  reactivate: "No pudimos reactivar el servidor. Intentá de nuevo.",
};

const FORBIDDEN_ERROR: Record<ServerSuspensionAction, string> = {
  suspend: "No tenés permisos de staff para suspender servidores.",
  reactivate: "No tenés permisos de staff para reactivar servidores.",
};

export function serverSuspensionErrorMessage(
  action: ServerSuspensionAction,
  code: string,
): string {
  switch (code) {
    case "FORBIDDEN":
      return FORBIDDEN_ERROR[action];
    case "SERVER_NOT_FOUND":
      return "Este servidor ya no existe.";
    default:
      return GENERIC_ERROR[action];
  }
}
