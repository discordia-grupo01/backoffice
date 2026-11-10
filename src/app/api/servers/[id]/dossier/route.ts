import { NextResponse } from "next/server";

import { unauthorizedResponse, upstreamFailureResponse } from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { getServerDossier } from "@/services/servers/service";
import type { ServerDossierSummary } from "@/types/servers.types";

type DossierResponse =
  { ok: true; summary: ServerDossierSummary } | { ok: false; message: string };

type RouteContext = { params: { id: string } };

export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse<DossierResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const result = await getServerDossier(session.token, params.id);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true, summary: result.data });
}
