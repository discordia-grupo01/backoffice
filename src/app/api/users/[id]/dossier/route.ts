import { NextResponse } from "next/server";

import { unauthorizedResponse, upstreamFailureResponse } from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { getUserDossier } from "@/services/users/service";
import type { UserDossierSummary } from "@/types/users.types";

type DossierResponse =
  { ok: true; summary: UserDossierSummary } | { ok: false; message: string };

type RouteContext = { params: { id: string } };

export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse<DossierResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const result = await getUserDossier(session.token, params.id);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true, summary: result.data });
}
