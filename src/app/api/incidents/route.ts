import { INVALID_DATA_MESSAGE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import { unauthorizedResponse, upstreamFailureResponse } from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { createIncident } from "@/services/status/service";
import { toIncidentInput } from "@/utils/incidents";

type CreateResponse = { ok: true } | { ok: false; message: string };

export async function POST(
  request: Request,
): Promise<NextResponse<CreateResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const input = toIncidentInput(await request.json().catch(() => null));
  if (!input) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await createIncident(session.token, input);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
