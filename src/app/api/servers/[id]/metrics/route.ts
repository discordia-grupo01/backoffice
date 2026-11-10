import { INVALID_DATA_MESSAGE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import {
  parseMetricsRange,
  unauthorizedResponse,
  upstreamFailureResponse,
} from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { getServerMetrics } from "@/services/metrics/service";
import type { ServerMetricsResponse } from "@/types/metrics.types";

type ServerMetricsRouteResponse =
  { ok: true; metrics: ServerMetricsResponse } | { ok: false; message: string };

type RouteContext = { params: { id: string } };

export async function GET(
  request: Request,
  { params }: RouteContext,
): Promise<NextResponse<ServerMetricsRouteResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const range = parseMetricsRange(new URL(request.url).searchParams);
  if (!range) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await getServerMetrics(session.token, params.id, range);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true, metrics: result.data });
}
