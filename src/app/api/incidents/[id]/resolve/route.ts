import { NextResponse } from "next/server";

import { unauthorizedResponse, upstreamFailureResponse } from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { resolveIncident } from "@/services/status/service";

type ResolveResponse = { ok: true } | { ok: false; message: string };

type RouteContext = { params: { id: string } };

export async function POST(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse<ResolveResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const result = await resolveIncident(session.token, params.id);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true });
}
