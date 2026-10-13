import type { Session } from "@/types/auth.types";

/**
 * Parsea y valida la forma de la cookie de sesion, sin depender de
 * `next/headers` ni de `server-only`: la usan `session.ts` (Route Handlers) y
 * `middleware.ts` (Edge Runtime). Solo valida forma, no vigencia del JWT.
 * Que los dos coincidan en que cuenta como "sesion presente" evita el loop de
 * redirects entre `/login` y una pagina protegida con una cookie corrupta.
 */
export function parseSessionCookie(raw: string | undefined): Session | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  return isSession(parsed) ? parsed : null;
}

function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const user = candidate.user as Record<string, unknown> | undefined;
  return (
    typeof candidate.token === "string" &&
    typeof candidate.refreshToken === "string" &&
    typeof user === "object" &&
    user !== null &&
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    typeof user.name === "string"
  );
}
