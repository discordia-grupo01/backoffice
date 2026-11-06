import { SERVER_REASONS } from "@discordia/client-shared";

const GENERIC_ERROR = "No pudimos eliminar el servidor. Intentá de nuevo.";

export function deleteServerErrorMessage(code: string): string {
  switch (code) {
    case "FORBIDDEN":
      return "No tenés permisos de staff para eliminar servidores.";
    case "DELETE_CONFIRMATION_MISMATCH":
      return SERVER_REASONS.confirmation_mismatch ?? GENERIC_ERROR;
    default:
      return GENERIC_ERROR;
  }
}
