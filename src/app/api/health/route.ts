import { NextResponse } from "next/server";

import { unauthorizedResponse, upstreamFailureResponse } from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import {
  getServiceHealth,
  type ServiceHealthResponse,
} from "@/services/status/service";

type HealthResponse =
  { ok: true; data: ServiceHealthResponse } | { ok: false; message: string };

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const result = await getServiceHealth(session.token);
  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    if (result.status === 403) {
      return NextResponse.json(
        { ok: false, message: "No tenés permisos para consultar la salud." },
        { status: 403 },
      );
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true, data: result.data });
}
