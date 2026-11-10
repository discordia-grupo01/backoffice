import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { dossierHref, useDossierUrl } from "./useDossierUrl";

const router = { push: vi.fn(), replace: vi.fn(), back: vi.fn() };
let search = "";

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/users",
  useSearchParams: () => new URLSearchParams(search),
}));

const SECTIONS = ["reports", "moderation"] as const;

beforeEach(() => {
  vi.clearAllMocks();
  search = "";
});

describe("useDossierUrl", () => {
  it("lee el expediente y la sección de la URL", () => {
    search = "expediente=abc&seccion=reports";
    const { result } = renderHook(() => useDossierUrl(SECTIONS));
    expect(result.current.subjectId).toBe("abc");
    expect(result.current.section).toBe("reports");
  });

  it("ignora una sección que no existe", () => {
    search = "expediente=abc&seccion=cualquiera";
    const { result } = renderHook(() => useDossierUrl(SECTIONS));
    expect(result.current.section).toBeNull();
  });

  it("abrir agrega el expediente al historial", () => {
    const { result } = renderHook(() => useDossierUrl(SECTIONS));
    act(() => result.current.open("abc"));
    expect(router.push).toHaveBeenCalledWith("/users?expediente=abc", {
      scroll: false,
    });
  });

  it("cerrar lo que se abrió acá vuelve atrás, sin dejar entradas repetidas", () => {
    const go = vi.spyOn(window.history, "go").mockImplementation(() => {});
    const { result, rerender } = renderHook(() => useDossierUrl(SECTIONS));
    act(() => result.current.open("abc"));
    search = "expediente=abc";
    rerender();
    act(() => result.current.openSection("reports"));
    search = "expediente=abc&seccion=reports";
    rerender();
    act(() => result.current.close());
    expect(go).toHaveBeenCalledWith(-2);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("cerrar un expediente que llegó por link reemplaza la URL", () => {
    search = "expediente=abc";
    const { result } = renderHook(() => useDossierUrl(SECTIONS));
    act(() => result.current.close());
    expect(router.replace).toHaveBeenCalledWith("/users", { scroll: false });
  });

  it("volver al resumen desde una sección abierta por link reemplaza la URL", () => {
    search = "expediente=abc&seccion=reports";
    const { result } = renderHook(() => useDossierUrl(SECTIONS));
    act(() => result.current.backToOverview());
    expect(router.replace).toHaveBeenCalledWith("/users?expediente=abc", {
      scroll: false,
    });
    expect(router.back).not.toHaveBeenCalled();
  });
});

describe("dossierHref", () => {
  it("arma el link al expediente", () => {
    expect(dossierHref("/servers", "a b")).toBe("/servers?expediente=a%20b");
  });
});
