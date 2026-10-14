import {
  INVALID_DATA_MESSAGE,
  LOGIN_UNAVAILABLE,
} from "@discordia/client-shared";

import { NextResponse } from "next/server";

import { unauthorizedResponse } from "@/lib/apiRoute";
import { getPlatformMetrics } from "@/services/metrics/service";
import { getSession } from "@/services/auth/session";
import type { PlatformMetrics } from "@/types/metrics.types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type MetricsResponse =
  { ok: true; metrics: PlatformMetrics } | { ok: false; message: string };

export async function GET(
  request: Request,
): Promise<NextResponse<MetricsResponse>> {
  if (!getSession()) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  if (!ISO_DATE.test(from) || !ISO_DATE.test(to) || from > to) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await getPlatformMetrics({ from, to });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: result.status === 403 ? result.message : LOGIN_UNAVAILABLE,
      },
      { status: result.status === 403 ? 403 : 502 },
    );
  }

  return NextResponse.json({ ok: true, metrics: result.data });
}
