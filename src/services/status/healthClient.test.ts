import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/browserApiClient";

import { getServiceHealth } from "./healthClient";

vi.mock("@/lib/browserApiClient", () => ({
  api: { get: vi.fn() },
}));

const mockedGet = vi.mocked(api.get);

describe("getServiceHealth", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("informa el 403 para distinguir falta de permisos de un error", async () => {
    mockedGet.mockResolvedValue({
      status: 403,
      data: { ok: false, message: "No tenés permisos" },
    });

    await expect(getServiceHealth()).resolves.toEqual({
      ok: false,
      status: 403,
      message: "No tenés permisos",
    });
  });

  it("si la red falla, el estado es 0", async () => {
    mockedGet.mockRejectedValue(new Error("network"));

    const result = await getServiceHealth();

    expect(result).toMatchObject({ ok: false, status: 0 });
  });
});
