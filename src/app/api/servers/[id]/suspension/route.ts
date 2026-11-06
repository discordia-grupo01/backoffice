import { LOGIN_UNAVAILABLE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/apiClient";
import { unauthorizedResponse } from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { reactivateServer, suspendServer } from "@/services/servers/service";
import type { PlatformServer } from "@/types/servers.types";

type SuspensionResponse =
  | { ok: true; server: PlatformServer }
  | { ok: false; code?: string; message: string };

type RouteContext = { params: { id: string } };

const FORWARDED_STATUSES = [403, 404, 409];

async function handle(
  serverId: string,
  send: (token: string, serverId: string) => Promise<ApiResult<PlatformServer>>,
): Promise<NextResponse<SuspensionResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const result = await send(session.token, serverId);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    if (FORWARDED_STATUSES.includes(result.status)) {
      return NextResponse.json(
        { ok: false, code: String(result.code), message: result.message },
        { status: result.status },
      );
    }
    return NextResponse.json(
      { ok: false, code: "UNAVAILABLE", message: LOGIN_UNAVAILABLE },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, server: result.data });
}

export function POST(_request: Request, { params }: RouteContext) {
  return handle(params.id, suspendServer);
}

export function DELETE(_request: Request, { params }: RouteContext) {
  return handle(params.id, reactivateServer);
}
