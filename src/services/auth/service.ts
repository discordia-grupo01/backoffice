import {
  type AuthResponse,
  type TwoFactorChallengePayload,
} from "@discordia/client-shared";

import "server-only";

import { apiRequestWithSetCookie, type ApiResult } from "@/lib/apiClient";
import { extractCookieValue } from "@/lib/setCookie";

const REFRESH_COOKIE_NAME = "refresh_token";

/**
 * Capa de servicios contra identify-service para el login del backoffice.
 *
 *   POST /v1/login -> 200 { user, token } + Set-Cookie refresh_token | 202 desafio de 2FA | 400 | 401 INVALID_CREDENTIALS
 *
 * El refresh token nunca viaja en el body: se extrae del header Set-Cookie.
 */
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
