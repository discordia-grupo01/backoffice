import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/lib/constants";
import { isProduction } from "@/lib/env";
import { parseSessionCookie } from "@/services/auth/session-shape";

import type { Session } from "@/types/auth.types";

// El refresh token de identify-service dura 30 dias; la cookie de sesion tiene
// que sobrevivir al menos eso, no los 15 minutos del access token.
const DEFAULT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/**
 * Escribe la sesion en una cookie httpOnly. El JS del navegador no puede leerla
 * (mitiga XSS); solo el servidor de Next la ve. Se llama unicamente desde Route
 * Handlers o Server Actions.
 */
export function createSession(session: Session): void {
  cookies().set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: DEFAULT_MAX_AGE_SECONDS,
  });
}

export function destroySession(): void {
  cookies().delete(SESSION_COOKIE);
}

/**
 * Lee la sesion tal cual esta en la cookie. `null` si no hay cookie o esta
 * corrupta. No valida que el access token siga vigente.
 */
export function getSession(): Session | null {
  return parseSessionCookie(cookies().get(SESSION_COOKIE)?.value);
}
