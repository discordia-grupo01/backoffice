import { describe, expect, it } from "vitest";

import { parseSessionCookie } from "./session-shape";

const VALID = {
  token: "jwt",
  refreshToken: "refresh",
  user: { id: "1", email: "a@b.com", name: "Ana" },
};

describe("parseSessionCookie", () => {
  it("acepta una sesion con la forma esperada", () => {
    expect(parseSessionCookie(JSON.stringify(VALID))).toEqual(VALID);
  });

  it("devuelve null sin cookie", () => {
    expect(parseSessionCookie(undefined)).toBeNull();
  });

  it("devuelve null con JSON corrupto", () => {
    expect(parseSessionCookie("{no es json")).toBeNull();
  });

  it("devuelve null si falta el refresh token", () => {
    const { refreshToken: _omit, ...incomplete } = VALID;
    expect(parseSessionCookie(JSON.stringify(incomplete))).toBeNull();
  });
});
