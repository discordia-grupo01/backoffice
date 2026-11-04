import { NextResponse, type NextRequest } from "next/server";

import { ROUTES, SESSION_COOKIE } from "@/lib/constants";
import { parseSessionCookie } from "@/services/auth/session-shape";

const PROTECTED_PREFIXES = [
  ROUTES.home,
  ROUTES.users,
  ROUTES.servers,
  ROUTES.status,
];

const GUEST_ONLY = [ROUTES.login];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const cookieValue = request.cookies.get(SESSION_COOKIE)?.value;
  const hasSession = parseSessionCookie(cookieValue) !== null;
  const hasStaleCookie = cookieValue !== undefined && !hasSession;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isGuestOnly = GUEST_ONLY.includes(
    pathname as (typeof GUEST_ONLY)[number],
  );

  let response: NextResponse;

  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.login;
    response = NextResponse.redirect(url);
  } else if (isGuestOnly && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.home;
    url.search = "";
    response = NextResponse.redirect(url);
  } else {
    response = NextResponse.next();
  }

  if (hasStaleCookie) response.cookies.delete(SESSION_COOKIE);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
