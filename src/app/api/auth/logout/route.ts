import { NextResponse } from "next/server";

import { logout } from "@/services/auth/service";
import { destroySession, getSession } from "@/services/auth/session";

export async function POST(): Promise<NextResponse> {
  const session = getSession();

  if (session) {
    await logout(session.token, session.refreshToken);
  }

  destroySession();

  return new NextResponse(null, { status: 204 });
}
