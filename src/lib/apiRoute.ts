import {
  INVALID_DATA_MESSAGE,
  REQUEST_FAILED_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
} from "@discordia/client-shared";

import { NextResponse } from "next/server";

import type { MetricsRange } from "@/types/metrics.types";

export const SESSION_EXPIRED = SESSION_EXPIRED_MESSAGE;

export function unauthorizedResponse(): NextResponse<{
  ok: false;
  message: string;
}> {
  return NextResponse.json(
    { ok: false, message: SESSION_EXPIRED },
    { status: 401 },
  );
}

export function parseInteger(
  raw: string | null,
  fallback: number,
): number | null {
  if (raw === null || raw === "") return fallback;
  return /^\d+$/.test(raw) ? Number(raw) : null;
}

function isInstant(value: string): boolean {
  return value !== "" && !Number.isNaN(Date.parse(value));
}

export function parseMetricsRange(
  searchParams: URLSearchParams,
): MetricsRange | null {
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  if (
    !isInstant(from) ||
    !isInstant(to) ||
    Date.parse(from) >= Date.parse(to)
  ) {
    return null;
  }
  return { from, to };
}

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
