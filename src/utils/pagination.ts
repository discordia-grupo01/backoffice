import { pageRange } from "@discordia/client-shared";

/** Elementos por página en los listados del panel. */
export const PAGE_SIZE = 10;

/** Tope de `limit` que aceptan los endpoints de listado del back. */
export const MAX_PAGE_SIZE = 100;

/** Página (1-based) -> `offset` del back. */
export function offsetOfPage(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/** "26 resultados" si entra todo en una página; "11-20 de 26" si hay más. */
export function resultsLabel(
  page: number,
  pageSize: number,
  total: number,
): string {
  if (total <= pageSize) {
    return `${total} ${total === 1 ? "resultado" : "resultados"}`;
  }
  const { from, to } = pageRange(page, pageSize, total);
  return `${from}-${to} de ${total}`;
}
