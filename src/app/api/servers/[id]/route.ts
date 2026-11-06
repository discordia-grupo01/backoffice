import {
  INVALID_DATA_MESSAGE,
  LOGIN_UNAVAILABLE,
} from "@discordia/client-shared";

import { NextResponse } from "next/server";

import { unauthorizedResponse } from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { deleteServer } from "@/services/servers/service";

type DeleteServerResponse =
  { ok: true } | { ok: false; code?: string; message: string };

type RouteContext = { params: { id: string } };

/** Estos errores dependen del servidor elegido: el navegador necesita el `code` para explicarlos. */
const FORWARDED_STATUSES = [400, 403, 404];

async function confirmNameOf(request: Request): Promise<string | null> {
  try {
    const body: unknown = await request.json();
    const value = (body as { confirm_name?: unknown } | null)?.confirm_name;
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext,
): Promise<NextResponse<DeleteServerResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const confirmName = await confirmNameOf(request);
  if (confirmName === null) {
    return NextResponse.json(
      { ok: false, code: "INVALID_BODY", message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await deleteServer(session.token, params.id, confirmName);

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

  return NextResponse.json({ ok: true }, { status: 202 });
}
