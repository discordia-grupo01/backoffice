import { LOGIN_UNAVAILABLE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/apiClient";
import { unauthorizedResponse } from "@/lib/apiRoute";
import { destroySession, getSession } from "@/services/auth/session";
import { reactivateUser, suspendUser } from "@/services/users/service";
import type { PlatformUser } from "@/types/users.types";

type SuspensionResponse =
  | { ok: true; user: PlatformUser }
  | { ok: false; code?: string; message: string };

type RouteContext = { params: { id: string } };

/** Estos errores dependen del usuario elegido: el navegador necesita el `code` para explicarlos. */
const FORWARDED_STATUSES = [403, 404, 409];

async function handle(
  userId: string,
  send: (token: string, userId: string) => Promise<ApiResult<PlatformUser>>,
): Promise<NextResponse<SuspensionResponse>> {
  const session = getSession();
  if (!session) return unauthorizedResponse();

  const result = await send(session.token, userId);

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

  return NextResponse.json({ ok: true, user: result.data });
}

export function POST(_request: Request, { params }: RouteContext) {
  return handle(params.id, suspendUser);
}

export function DELETE(_request: Request, { params }: RouteContext) {
  return handle(params.id, reactivateUser);
}
