import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { suspendUser } from "@/services/users/client";
import type { PlatformUser } from "@/types/users.types";

import { useSuspendUser } from "./useSuspendUser";

vi.mock("@/services/users/client", () => ({ suspendUser: vi.fn() }));

const mockedSuspend = vi.mocked(suspendUser);

const BETO: PlatformUser = {
  id: "b3c1",
  name: "Beto",
  email: "beto@mail.com",
  status: "active",
  created_at: "2026-01-01T00:00:00Z",
  suspended_at: null,
};

function setup() {
  const onSuspended = vi.fn();
  const hook = renderHook(() => useSuspendUser({ onSuspended }));
  act(() => hook.result.current.request(BETO));
  return { ...hook, onSuspended };
}

describe("useSuspendUser", () => {
  beforeEach(() => {
    mockedSuspend.mockReset();
  });

  it("pide confirmación antes de suspender", () => {
    const { result } = setup();

    expect(result.current.target).toEqual(BETO);
    expect(mockedSuspend).not.toHaveBeenCalled();
  });

  it("al confirmar suspende, cierra y avisa con la cuenta actualizada", async () => {
    const suspended = {
      ...BETO,
      status: "suspended" as const,
      suspended_at: "2026-10-26T12:00:00Z",
    };
    mockedSuspend.mockResolvedValue({ ok: true, user: suspended });
    const { result, onSuspended } = setup();

    await act(() => result.current.confirm());

    expect(mockedSuspend).toHaveBeenCalledWith("b3c1");
    expect(onSuspended).toHaveBeenCalledWith(suspended);
    expect(result.current.target).toBeNull();
  });

  it("si ya estaba suspendido lo trata como éxito", async () => {
    mockedSuspend.mockResolvedValue({
      ok: false,
      status: 409,
      code: "USER_ALREADY_SUSPENDED",
      message: "",
    });
    const { result, onSuspended } = setup();

    await act(() => result.current.confirm());

    expect(onSuspended).toHaveBeenCalledWith({ ...BETO, status: "suspended" });
    expect(result.current.target).toBeNull();
  });

  it("si falla deja el modal abierto con el error", async () => {
    mockedSuspend.mockResolvedValue({
      ok: false,
      status: 403,
      code: "CANNOT_SUSPEND_STAFF",
      message: "",
    });
    const { result, onSuspended } = setup();

    await act(() => result.current.confirm());

    expect(onSuspended).not.toHaveBeenCalled();
    expect(result.current.target).toEqual(BETO);
    expect(result.current.error).toBe(
      "No se puede suspender a un miembro del staff.",
    );
  });

  it("al volver a abrir limpia el error anterior", async () => {
    mockedSuspend.mockResolvedValue({
      ok: false,
      status: 0,
      code: "NETWORK_ERROR",
      message: "",
    });
    const { result } = setup();
    await act(() => result.current.confirm());
    act(() => result.current.cancel());

    act(() => result.current.request(BETO));

    expect(result.current.error).toBeUndefined();
  });
});
