import { NextResponse } from "next/server";

import { logout } from "@/services/auth/service";
import { destroySession, getValidSession } from "@/services/auth/session";

export async function POST(): Promise<NextResponse> {
  const session = await getValidSession();

  if (session) {
    await logout(session.token, session.refreshToken);
  }

  destroySession();

  return new NextResponse(null, { status: 204 });
}
