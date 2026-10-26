import { LOGIN_UNAVAILABLE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import { unauthorizedResponse } from "@/lib/apiRoute";
import { destroySession, getSession } from "@/services/auth/session";
import { suspendUser } from "@/services/users/service";
import type { PlatformUser } from "@/types/users.types";

type SuspendUserResponse =
  | { ok: true; user: PlatformUser }
  | { ok: false; code?: string; message: string };

/** Estos errores dependen del usuario elegido: el navegador necesita el `code` para explicarlos. */
const FORWARDED_STATUSES = [403, 404, 409];

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<SuspendUserResponse>> {
  const session = getSession();
  if (!session) return unauthorizedResponse();

  const result = await suspendUser(session.token, params.id);

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
