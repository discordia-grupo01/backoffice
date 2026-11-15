import {
  type AuthResponse,
  type TwoFactorChallengePayload,
} from "@discordia/client-shared";

import "server-only";

import {
  apiRequest,
  apiRequestWithSetCookie,
  type ApiResult,
} from "@/lib/apiClient";
import { extractCookieValue } from "@/lib/setCookie";

const REFRESH_COOKIE_NAME = "refresh_token";

export async function login(credentials: {
  email: string;
  password: string;
}): Promise<{
  result: ApiResult<AuthResponse | TwoFactorChallengePayload>;
  refreshToken: string | null;
}> {
  const { result, setCookieHeader } = await apiRequestWithSetCookie<
    AuthResponse | TwoFactorChallengePayload
  >("/v1/login", {
    method: "POST",
    data: credentials,
  });
  return {
    result,
    refreshToken: extractCookieValue(setCookieHeader, REFRESH_COOKIE_NAME),
  };
}

export function checkStaff(token: string): Promise<ApiResult<void>> {
  return apiRequest<void>("/v1/admin/me", { token });
}

export function logout(
  token: string,
  refreshToken: string,
): Promise<ApiResult<void>> {
  return apiRequest<void>("/v1/logout", {
    method: "POST",
    token,
    cookie: refreshToken,
  });
}

export async function refresh(refreshToken: string): Promise<{
  result: ApiResult<AuthResponse>;
  newRefreshToken: string | null;
}> {
  const { result, setCookieHeader } =
    await apiRequestWithSetCookie<AuthResponse>("/v1/refresh", {
      method: "POST",
      cookie: refreshToken,
    });
  return {
    result,
    newRefreshToken: extractCookieValue(setCookieHeader, REFRESH_COOKIE_NAME),
  };
}
