import type { SessionBase } from "@discordia/client-shared";

/**
 * Lo unico de auth que es propio del backoffice. `User`, `LoginResult` y los
 * demas contratos salen de `@discordia/client-shared`: los define el backend.
 */
export interface Session extends SessionBase {
  /** Refresh token de identify-service. Vive en la cookie httpOnly, nunca en el JS del navegador. */
  refreshToken: string;
}
