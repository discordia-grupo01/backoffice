import { INVALID_DATA_MESSAGE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import {
  parseMetricsRange,
  unauthorizedResponse,
  upstreamFailureResponse,
} from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { getServerGrowth } from "@/services/metrics/service";
import type { ServerGrowthResponse } from "@/types/metrics.types";

type ServerGrowthRouteResponse =
  { ok: true; growth: ServerGrowthResponse } | { ok: false; message: string };

type RouteContext = { params: { id: string } };

export async function GET(
  request: Request,
  { params }: RouteContext,
): Promise<NextResponse<ServerGrowthRouteResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const range = parseMetricsRange(new URL(request.url).searchParams);
  if (!range) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await getServerGrowth(session.token, params.id, range);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true, growth: result.data });
}
