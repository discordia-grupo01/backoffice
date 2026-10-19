import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePagedList, type PagedResult } from "./usePagedList";

interface Filters {
  status: "all" | "active";
}

const EMPTY: Filters = { status: "all" };

function pageOf(total: number, items: string[] = ["a"]): PagedResult<string> {
  return { ok: true, items, total };
}

describe("usePagedList", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("pide la primera página al montar", async () => {
    const fetchPage = vi.fn().mockResolvedValue(pageOf(1));
    const { result } = renderHook(() =>
      usePagedList({ fetchPage, emptyFilters: EMPTY, pageSize: 10 }),
    );

    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(fetchPage).toHaveBeenCalledWith({
      search: "",
      filters: EMPTY,
      limit: 10,
      offset: 0,
    });
    expect(result.current.items).toEqual(["a"]);
    expect(result.current.total).toBe(1);
  });

  it("pide el offset de la página elegida", async () => {
    const fetchPage = vi.fn().mockResolvedValue(pageOf(50));
    const { result } = renderHook(() =>
      usePagedList({ fetchPage, emptyFilters: EMPTY, pageSize: 10 }),
    );
    await waitFor(() => expect(result.current.status).toBe("success"));

    act(() => result.current.setPage(3));

    await waitFor(() =>
      expect(fetchPage).toHaveBeenLastCalledWith(
        expect.objectContaining({ limit: 10, offset: 20 }),
      ),
    );
  });

  it("espera a que termine de escribir y vuelve a la primera página", async () => {
    const fetchPage = vi.fn().mockResolvedValue(pageOf(50));
    const { result } = renderHook(() =>
      usePagedList({ fetchPage, emptyFilters: EMPTY, pageSize: 10 }),
    );
    await waitFor(() => expect(result.current.status).toBe("success"));
    act(() => result.current.setPage(3));
    await waitFor(() => expect(result.current.page).toBe(3));
    fetchPage.mockClear();

    act(() => result.current.setSearch("lu"));
    expect(result.current.page).toBe(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });
    expect(fetchPage).not.toHaveBeenCalledWith(
      expect.objectContaining({ search: "lu" }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    await waitFor(() =>
      expect(fetchPage).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: "lu", offset: 0 }),
      ),
    );
  });

  it("un filtro nuevo vuelve a pedir con ese filtro y cuenta como activo", async () => {
    const fetchPage = vi.fn().mockResolvedValue(pageOf(1));
    const { result } = renderHook(() =>
      usePagedList({ fetchPage, emptyFilters: EMPTY }),
    );
    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.hasActiveFilters).toBe(false);

    act(() => result.current.setFilters({ status: "active" }));

    expect(result.current.hasActiveFilters).toBe(true);
    await waitFor(() =>
      expect(fetchPage).toHaveBeenLastCalledWith(
        expect.objectContaining({ filters: { status: "active" } }),
      ),
    );

    act(() => result.current.clear());
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("si la página pedida ya no existe, salta a la última", async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(pageOf(50))
      .mockResolvedValueOnce(pageOf(12, []))
      .mockResolvedValue(pageOf(12, ["b"]));
    const { result } = renderHook(() =>
      usePagedList({ fetchPage, emptyFilters: EMPTY, pageSize: 10 }),
    );
    await waitFor(() => expect(result.current.status).toBe("success"));

    act(() => result.current.setPage(5));

    await waitFor(() => expect(result.current.page).toBe(2));
    await waitFor(() => expect(result.current.items).toEqual(["b"]));
  });

  it("no muestra un resultado viejo mientras espera o pide lo nuevo", async () => {
    const fetchPage = vi.fn().mockResolvedValue(pageOf(0, []));
    const { result } = renderHook(() =>
      usePagedList({ fetchPage, emptyFilters: EMPTY }),
    );
    await waitFor(() => expect(result.current.status).toBe("success"));

    act(() => result.current.setSearch("emiliano"));
    expect(result.current.status).toBe("loading");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    await waitFor(() => expect(result.current.status).toBe("success"));

    act(() => result.current.clear());
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(fetchPage).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: "" }),
    );
  });

  it("distingue 403 de un error común y permite reintentar", async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 502, message: "x" })
      .mockResolvedValueOnce({ ok: false, status: 403, message: "x" });
    const { result } = renderHook(() =>
      usePagedList({ fetchPage, emptyFilters: EMPTY }),
    );

    await waitFor(() => expect(result.current.status).toBe("error"));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.status).toBe("forbidden"));
  });
});
