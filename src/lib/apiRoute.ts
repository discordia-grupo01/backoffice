import {
  INVALID_DATA_MESSAGE,
  REQUEST_FAILED_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
} from "@discordia/client-shared";

import { NextResponse } from "next/server";

export const SESSION_EXPIRED = SESSION_EXPIRED_MESSAGE;

/** 401 estándar para los Route Handlers: sin sesión o el backend la rechazó. */
export function unauthorizedResponse(): NextResponse<{
  ok: false;
  message: string;
}> {
  return NextResponse.json(
    { ok: false, message: SESSION_EXPIRED },
    { status: 401 },
  );
}

/** Entero no negativo de un query param; `fallback` si falta, `null` si es inválido. */
export function parseInteger(
  raw: string | null,
  fallback: number,
): number | null {
  if (raw === null || raw === "") return fallback;
  return /^\d+$/.test(raw) ? Number(raw) : null;
}

/**
 * Error del backend que no es 401: 400, 403 y 404 se reenvían tal cual para que
 * el navegador sepa qué pasó; el resto se informa como 502.
 */
export function upstreamFailureResponse(status: number): NextResponse<{
  ok: false;
  message: string;
}> {
  if (status === 400) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status },
    );
  }
  if (status === 403 || status === 404) {
    return NextResponse.json(
      { ok: false, message: REQUEST_FAILED_MESSAGE },
      { status },
    );
  }
  return NextResponse.json(
    { ok: false, message: REQUEST_FAILED_MESSAGE },
    { status: 502 },
  );
}
