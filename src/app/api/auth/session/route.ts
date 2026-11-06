import { NextResponse } from "next/server";

import { getValidSession } from "@/services/auth/session";

export async function GET(): Promise<
  NextResponse<{ ok: boolean; userId?: string }>
> {
  const session = await getValidSession();
  return NextResponse.json(
    session ? { ok: true, userId: session.user.id } : { ok: false },
    { status: 200 },
  );
}
