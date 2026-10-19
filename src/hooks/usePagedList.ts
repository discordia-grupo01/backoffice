"use client";

import { pageCountOf } from "@discordia/client-shared";

import { useCallback, useEffect, useRef, useState } from "react";

import { ROUTES } from "@/lib/constants";
import { offsetOfPage, PAGE_SIZE } from "@/utils/pagination";

import { useDebouncedValue } from "./useDebouncedValue";

export type PagedListStatus = "loading" | "success" | "error" | "forbidden";

export type PagedResult<T> =
  | { ok: true; items: T[]; total: number }
  | { ok: false; status: number; message: string };

export interface PageRequest<F> {
  search: string;
  filters: F;
  limit: number;
  offset: number;
}

interface UsePagedListOptions<T, F extends object> {
  /** Pide una página al back. Los filtros ya vienen aplicados y la búsqueda con debounce. */
  fetchPage: (request: PageRequest<F>) => Promise<PagedResult<T>>;
  /** Valores de los filtros sin ninguna selección: sirve para saber si hay filtros activos. */
  emptyFilters: F;
  pageSize?: number;
}

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Un listado del panel paginado, buscado y filtrado EN EL BACK, de a una página
 * por vez. Cada sección (usuarios, servidores, ...) lo envuelve con su propio
 * `fetchPage`. Mientras llega una página nueva se sigue mostrando la anterior.
 */
export function usePagedList<T, F extends object>({
  fetchPage,
  emptyFilters,
  pageSize = PAGE_SIZE,
}: UsePagedListOptions<T, F>) {
  const [search, setSearchState] = useState("");
  const [filters, setFiltersState] = useState<F>(emptyFilters);
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<{
    key: string;
    status: Exclude<PagedListStatus, "loading">;
  } | null>(null);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);

  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;

  const trimmedSearch = search.trim();
  const debouncedSearch = useDebouncedValue(
    trimmedSearch,
    trimmedSearch === "" ? 0 : SEARCH_DEBOUNCE_MS,
  );

  const requestKey = JSON.stringify([
    debouncedSearch,
    filters,
    page,
    pageSize,
    attempt,
  ]);

  useEffect(() => {
    let cancelled = false;

    fetchPageRef
      .current({
        search: debouncedSearch,
        filters,
        limit: pageSize,
        offset: offsetOfPage(page, pageSize),
      })
      .then((result) => {
        if (cancelled) return;
        if (result.ok) {
          const lastPage = pageCountOf(result.total, pageSize);
          if (page > lastPage) {
            setPage(lastPage);
            return;
          }
          setItems(result.items);
          setTotal(result.total);
          setSettled({ key: requestKey, status: "success" });
        } else if (result.status === 401) {
          window.location.href = ROUTES.login;
        } else {
          setSettled({
            key: requestKey,
            status: result.status === 403 ? "forbidden" : "error",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, debouncedSearch, filters, page, pageSize]);

  const status: PagedListStatus =
    trimmedSearch !== debouncedSearch || settled?.key !== requestKey
      ? "loading"
      : settled.status;

  const hasActiveFilters =
    search.trim() !== "" ||
    (Object.keys(emptyFilters) as (keyof F)[]).some(
      (key) => filters[key] !== emptyFilters[key],
    );

  return {
    items,
    total,
    status,
    page,
    pageSize,
    setPage,
    search,
    setSearch: (next: string) => {
      setSearchState(next);
      setPage(1);
    },
    filters,
    setFilters: (patch: Partial<F>) => {
      setFiltersState((prev) => ({ ...prev, ...patch }));
      setPage(1);
    },
    hasActiveFilters,
    clear: () => {
      setSearchState("");
      setFiltersState(emptyFilters);
      setPage(1);
    },
    retry: useCallback(() => setAttempt((value) => value + 1), []),
  };
}
