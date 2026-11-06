import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { reactivateServer, suspendServer } from "@/services/servers/client";
import type {
  PlatformServer,
  ServerSuspensionAction,
} from "@/types/servers.types";

import { useServerSuspension } from "./useServerSuspension";

vi.mock("@/services/servers/client", () => ({
  suspendServer: vi.fn(),
  reactivateServer: vi.fn(),
}));

const mockedSuspend = vi.mocked(suspendServer);
const mockedReactivate = vi.mocked(reactivateServer);

const TRUCHOS: PlatformServer = {
  id: "s1",
  name: "Truchos SA",
  owner_id: "u1",
  owner_name: "Beto",
  member_count: 3,
  created_at: "2026-01-01T00:00:00Z",
  suspended_at: null,
};

const SUSPENDED_TRUCHOS: PlatformServer = {
  ...TRUCHOS,
  suspended_at: "2026-11-06T12:00:00Z",
};

function setup(server: PlatformServer, action: ServerSuspensionAction) {
  const onChanged = vi.fn();
  const hook = renderHook(() => useServerSuspension({ onChanged }));
  act(() => hook.result.current.request(server, action));
  return { ...hook, onChanged };
}

describe("useServerSuspension", () => {
  beforeEach(() => {
    mockedSuspend.mockReset();
    mockedReactivate.mockReset();
  });

  it("pide confirmación antes de mandar nada", () => {
    const { result } = setup(TRUCHOS, "suspend");

    expect(result.current.pending).toEqual({
      server: TRUCHOS,
      action: "suspend",
    });
    expect(mockedSuspend).not.toHaveBeenCalled();
  });

  it("al confirmar suspende, cierra y avisa con el servidor actualizado", async () => {
    mockedSuspend.mockResolvedValue({ ok: true, server: SUSPENDED_TRUCHOS });
    const { result, onChanged } = setup(TRUCHOS, "suspend");

    await act(() => result.current.confirm());

    expect(mockedSuspend).toHaveBeenCalledWith("s1");
    expect(onChanged).toHaveBeenCalledWith(SUSPENDED_TRUCHOS);
    expect(result.current.pending).toBeNull();
  });

  it("al reactivar usa la otra acción", async () => {
    mockedReactivate.mockResolvedValue({ ok: true, server: TRUCHOS });
    const { result, onChanged } = setup(SUSPENDED_TRUCHOS, "reactivate");

    await act(() => result.current.confirm());

    expect(mockedReactivate).toHaveBeenCalledWith("s1");
    expect(onChanged).toHaveBeenCalledWith(TRUCHOS);
  });

  it("si otra persona del staff ya lo había reactivado, lo muestra activo sin error", async () => {
    mockedReactivate.mockResolvedValue({
      ok: false,
      status: 409,
      code: "SERVER_NOT_SUSPENDED",
      message: "",
    });
    const { result, onChanged } = setup(SUSPENDED_TRUCHOS, "reactivate");

    await act(() => result.current.confirm());

    expect(onChanged).toHaveBeenCalledWith(TRUCHOS);
    expect(result.current.error).toBeUndefined();
    expect(result.current.pending).toBeNull();
  });

  it("ante un error deja la confirmación abierta con el mensaje", async () => {
    mockedSuspend.mockResolvedValue({
      ok: false,
      status: 403,
      code: "FORBIDDEN",
      message: "",
    });
    const { result, onChanged } = setup(TRUCHOS, "suspend");

    await act(() => result.current.confirm());

    expect(result.current.pending).not.toBeNull();
    expect(result.current.error).toBe(
      "No tenés permisos de staff para suspender servidores.",
    );
    expect(onChanged).not.toHaveBeenCalled();
  });
});
