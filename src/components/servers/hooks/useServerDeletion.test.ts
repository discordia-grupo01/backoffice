import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteServer } from "@/services/servers/client";
import type { PlatformServer } from "@/types/servers.types";

import { useServerDeletion } from "./useServerDeletion";

vi.mock("@/services/servers/client", () => ({ deleteServer: vi.fn() }));

const mockedDelete = vi.mocked(deleteServer);

const TRUCHOS: PlatformServer = {
  id: "s1",
  name: "Truchos SA",
  owner_id: "u1",
  owner_name: "Beto",
  member_count: 3,
  created_at: "2026-01-01T00:00:00Z",
};

function setup() {
  const onDeleted = vi.fn();
  const onDismissed = vi.fn();
  const hook = renderHook(() => useServerDeletion({ onDeleted, onDismissed }));
  act(() => hook.result.current.request(TRUCHOS));
  return { ...hook, onDeleted, onDismissed };
}

describe("useServerDeletion", () => {
  beforeEach(() => {
    mockedDelete.mockReset();
  });

  it("no deja confirmar hasta que el nombre coincide exacto", () => {
    const { result } = setup();

    act(() => result.current.setConfirmName("truchos sa"));
    expect(result.current.canConfirm).toBe(false);

    act(() => result.current.setConfirmName("  Truchos SA "));
    expect(result.current.canConfirm).toBe(true);
  });

  it("al confirmar manda el nombre sin espacios y avisa que el pedido quedó en curso", async () => {
    mockedDelete.mockResolvedValue({ ok: true });
    const { result, onDeleted } = setup();
    act(() => result.current.setConfirmName(" Truchos SA "));

    await act(() => result.current.confirm());

    expect(mockedDelete).toHaveBeenCalledWith("s1", "Truchos SA");
    expect(result.current.pending).toBeNull();
    expect(result.current.result).toEqual({
      server: TRUCHOS,
      outcome: "requested",
    });
    expect(onDeleted).toHaveBeenCalledWith(TRUCHOS);
  });

  it("si ya no existía lo informa como ya eliminado", async () => {
    mockedDelete.mockResolvedValue({
      ok: false,
      status: 404,
      code: "SERVER_NOT_FOUND",
      message: "",
    });
    const { result } = setup();
    act(() => result.current.setConfirmName("Truchos SA"));

    await act(() => result.current.confirm());

    expect(result.current.result?.outcome).toBe("alreadyDeleted");
  });

  it("ante un error deja la confirmación abierta con el mensaje", async () => {
    mockedDelete.mockResolvedValue({
      ok: false,
      status: 403,
      code: "FORBIDDEN",
      message: "",
    });
    const { result, onDeleted } = setup();
    act(() => result.current.setConfirmName("Truchos SA"));

    await act(() => result.current.confirm());

    expect(result.current.pending).toEqual(TRUCHOS);
    expect(result.current.error).toBe(
      "No tenés permisos de staff para eliminar servidores.",
    );
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it("al cerrar el resultado avisa para recargar el listado", async () => {
    mockedDelete.mockResolvedValue({ ok: true });
    const { result, onDismissed } = setup();
    act(() => result.current.setConfirmName("Truchos SA"));
    await act(() => result.current.confirm());

    act(() => result.current.dismissResult());

    expect(result.current.result).toBeNull();
    expect(onDismissed).toHaveBeenCalled();
  });
});
