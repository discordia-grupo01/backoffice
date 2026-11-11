import { INVALID_DATA_MESSAGE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import {
  parseMetricsRange,
  unauthorizedResponse,
  upstreamFailureResponse,
} from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { exportServerMetrics } from "@/services/metrics/service";

type RouteContext = { params: { id: string } };

export async function GET(
  request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const range = parseMetricsRange(new URL(request.url).searchParams);
  if (!range) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await exportServerMetrics(session.token, params.id, range);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return new Response(result.data, {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
}
