import {
  INVALID_DATA_MESSAGE,
  LOGIN_UNAVAILABLE,
} from "@discordia/client-shared";

import { NextResponse } from "next/server";

import { unauthorizedResponse } from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { getGlobalMetrics } from "@/services/metrics/service";
import type { GlobalMetricsResponse } from "@/types/metrics.types";

type MetricsResponse =
  { ok: true; metrics: GlobalMetricsResponse } | { ok: false; message: string };

function isInstant(value: string): boolean {
  return value !== "" && !Number.isNaN(Date.parse(value));
}

export async function GET(
  request: Request,
): Promise<NextResponse<MetricsResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  if (
    !isInstant(from) ||
    !isInstant(to) ||
    Date.parse(from) >= Date.parse(to)
  ) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await getGlobalMetrics(session.token, { from, to });

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    if (result.status === 403 || result.status === 400) {
      return NextResponse.json(
        {
          ok: false,
          message:
            result.status === 400 ? INVALID_DATA_MESSAGE : result.message,
        },
        { status: result.status },
      );
    }
    return NextResponse.json(
      { ok: false, message: LOGIN_UNAVAILABLE },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, metrics: result.data });
}
