import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { reactivateUser, suspendUser } from "@/services/users/client";
import type { PlatformUser, SuspensionAction } from "@/types/users.types";

import { useUserSuspension } from "./useUserSuspension";

vi.mock("@/services/users/client", () => ({
  suspendUser: vi.fn(),
  reactivateUser: vi.fn(),
}));

const mockedSuspend = vi.mocked(suspendUser);
const mockedReactivate = vi.mocked(reactivateUser);

const BETO: PlatformUser = {
  id: "b3c1",
  name: "Beto",
  email: "beto@mail.com",
  status: "active",
  created_at: "2026-01-01T00:00:00Z",
  suspended_at: null,
};

const SUSPENDED_BETO: PlatformUser = {
  ...BETO,
  status: "suspended",
  suspended_at: "2026-10-26T12:00:00Z",
};

function setup(user: PlatformUser, action: SuspensionAction) {
  const onChanged = vi.fn();
  const hook = renderHook(() => useUserSuspension({ onChanged }));
  act(() => hook.result.current.request(user, action));
  return { ...hook, onChanged };
}

describe("useUserSuspension", () => {
  beforeEach(() => {
    mockedSuspend.mockReset();
    mockedReactivate.mockReset();
  });

  it("pide confirmación antes de mandar nada", () => {
    const { result } = setup(BETO, "suspend");

    expect(result.current.pending).toEqual({ user: BETO, action: "suspend" });
    expect(mockedSuspend).not.toHaveBeenCalled();
  });

  it("al confirmar suspende, cierra y avisa con la cuenta actualizada", async () => {
    mockedSuspend.mockResolvedValue({ ok: true, user: SUSPENDED_BETO });
    const { result, onChanged } = setup(BETO, "suspend");

    await act(() => result.current.confirm());

    expect(mockedSuspend).toHaveBeenCalledWith("b3c1");
    expect(onChanged).toHaveBeenCalledWith(SUSPENDED_BETO);
    expect(result.current.pending).toBeNull();
  });

  it("al confirmar una reactivación llama a reactivar", async () => {
    mockedReactivate.mockResolvedValue({ ok: true, user: BETO });
    const { result, onChanged } = setup(SUSPENDED_BETO, "reactivate");

    await act(() => result.current.confirm());

    expect(mockedReactivate).toHaveBeenCalledWith("b3c1");
    expect(mockedSuspend).not.toHaveBeenCalled();
    expect(onChanged).toHaveBeenCalledWith(BETO);
  });

  it("si ya estaba suspendido lo trata como éxito", async () => {
    mockedSuspend.mockResolvedValue({
      ok: false,
      status: 409,
      code: "USER_ALREADY_SUSPENDED",
      message: "",
    });
    const { result, onChanged } = setup(BETO, "suspend");

    await act(() => result.current.confirm());

    expect(onChanged).toHaveBeenCalledWith({ ...BETO, status: "suspended" });
    expect(result.current.pending).toBeNull();
  });

  it("si ya estaba activo lo trata como éxito", async () => {
    mockedReactivate.mockResolvedValue({
      ok: false,
      status: 409,
      code: "USER_NOT_SUSPENDED",
      message: "",
    });
    const { result, onChanged } = setup(SUSPENDED_BETO, "reactivate");

    await act(() => result.current.confirm());

    expect(onChanged).toHaveBeenCalledWith(BETO);
    expect(result.current.pending).toBeNull();
  });

  it("si falla deja el modal abierto con el error de esa acción", async () => {
    mockedReactivate.mockResolvedValue({
      ok: false,
      status: 403,
      code: "FORBIDDEN",
      message: "",
    });
    const { result, onChanged } = setup(SUSPENDED_BETO, "reactivate");

    await act(() => result.current.confirm());

    expect(onChanged).not.toHaveBeenCalled();
    expect(result.current.pending).not.toBeNull();
    expect(result.current.error).toBe(
      "No tenés permisos de staff para reactivar usuarios.",
    );
  });

  it("al volver a abrir limpia el error anterior", async () => {
    mockedSuspend.mockResolvedValue({
      ok: false,
      status: 0,
      code: "NETWORK_ERROR",
      message: "",
    });
    const { result } = setup(BETO, "suspend");
    await act(() => result.current.confirm());
    act(() => result.current.cancel());

    act(() => result.current.request(BETO, "suspend"));

    expect(result.current.error).toBeUndefined();
  });
});
