import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useDossierHistory } from "./useDossierHistory";

function setup() {
  const onClose = vi.fn();
  const hook = renderHook(({ isOpen }) => useDossierHistory(isOpen, onClose), {
    initialProps: { isOpen: true },
  });
  return { onClose, ...hook };
}

describe("useDossierHistory", () => {
  afterEach(() => {
    window.history.replaceState(null, "");
  });

  it("al abrir agrega una entrada al historial", () => {
    const before = window.history.length;
    setup();
    expect(window.history.length).toBe(before + 1);
  });

  it("atrás desde 'Ver todos' vuelve al resumen sin cerrar", async () => {
    const { result, onClose } = setup();

    act(() => result.current.openSection("servers"));
    expect(result.current.section).toBe("servers");

    act(() => window.history.back());
    await waitFor(() => expect(result.current.section).toBeNull());
    expect(onClose).not.toHaveBeenCalled();
  });

  it("atrás desde el resumen cierra el expediente", async () => {
    const { onClose } = setup();

    act(() => window.history.back());
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("cerrar desde 'Ver todos' saca las dos entradas y cierra", async () => {
    const { result, onClose } = setup();
    act(() => result.current.openSection("reports"));

    act(() => result.current.close());
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(window.history.state?.userDossier).toBeUndefined();
  });

  it("si quedaron entradas huérfanas con el expediente cerrado, las saltea", async () => {
    window.history.pushState({ userDossier: "overview" }, "");
    const back = vi.spyOn(window.history, "go");

    renderHook(() => useDossierHistory(false, vi.fn()));

    expect(back).toHaveBeenCalledWith(-1);
    back.mockRestore();
  });
});
