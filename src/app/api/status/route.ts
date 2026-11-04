import { NextResponse } from "next/server";

import { unauthorizedResponse, upstreamFailureResponse } from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { getPlatformStatus } from "@/services/status/service";
import type { PlatformStatusResponse } from "@/types/status.types";

type StatusResponse =
  { ok: true; data: PlatformStatusResponse } | { ok: false; message: string };

export async function GET(): Promise<NextResponse<StatusResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const result = await getPlatformStatus(session.token);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true, data: result.data });
}
