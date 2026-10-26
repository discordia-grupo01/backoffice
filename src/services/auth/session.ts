import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/lib/constants";
import { isProduction } from "@/lib/env";
import { refresh } from "@/services/auth/service";
import { parseSessionCookie } from "@/services/auth/session-shape";

import type { Session } from "@/types/auth.types";

const REFRESH_SKEW_SECONDS = 30;

// El refresh token de identify-service dura 30 dias; la cookie de sesion tiene
// que sobrevivir al menos eso, no los 15 minutos del access token.
const DEFAULT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const REFRESH_REUSE_WINDOW_MS = 30_000;

type RefreshOutcome = Awaited<ReturnType<typeof refresh>>;

const globalForRefresh = globalThis as typeof globalThis & {
  __backofficeRefreshes?: Map<string, Promise<RefreshOutcome>>;
};

function recentRefreshes(): Map<string, Promise<RefreshOutcome>> {
  globalForRefresh.__backofficeRefreshes ??= new Map();
  return globalForRefresh.__backofficeRefreshes;
}

function refreshOnce(refreshToken: string): Promise<RefreshOutcome> {
  const refreshes = recentRefreshes();
  const existing = refreshes.get(refreshToken);
  if (existing) return existing;

  const outcome = refresh(refreshToken);
  refreshes.set(refreshToken, outcome);

  const forget = () => refreshes.delete(refreshToken);
  outcome.then(({ result }) => {
    if (!result.ok) return forget();
    setTimeout(forget, REFRESH_REUSE_WINDOW_MS).unref?.();
  }, forget);
  return outcome;
}

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

export async function getValidSession(): Promise<Session | null> {
  const session = getSession();
  if (!session) return null;

  const exp = decodeJwtPayload(session.token)?.exp;
  const stillValid =
    typeof exp === "number" && exp - REFRESH_SKEW_SECONDS > Date.now() / 1000;
  if (stillValid) return session;

  const { result, newRefreshToken } = await refreshOnce(session.refreshToken);
  if (!result.ok) {
    destroySession();
    return null;
  }

  const newSession: Session = {
    token: result.data.token,
    refreshToken: newRefreshToken ?? session.refreshToken,
    user: result.data.user,
  };
  createSession(newSession);
  return newSession;
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  const segments = token.split(".");
  if (segments.length !== 3) return null;
  try {
    const json = Buffer.from(segments[1], "base64url").toString("utf8");
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}
