import { pageRange } from "@discordia/client-shared";

/** Elementos por página en los listados del panel. 12 se reparte exacto en 1, 2 y 3 columnas de tarjetas: la grilla nunca termina con una fila incompleta. */
export const PAGE_SIZE = 12;

/** Tope de `limit` que aceptan los endpoints de listado del back. */
export const MAX_PAGE_SIZE = 100;

/** Largo máximo de la búsqueda que acepta el back. */
export const SEARCH_MAX_LENGTH = 100;

/** Página (1-based) -> `offset` del back. */
export function offsetOfPage(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/** Total de un listado: "1 resultado", "26 resultados". Va arriba de la lista. */
export function totalLabel(total: number): string {
  return `${total} ${total === 1 ? "resultado" : "resultados"}`;
}

/** Rango de la página actual: "11-20 de 26". Va al pie, junto al paginador. */
export function rangeLabel(
  page: number,
  pageSize: number,
  total: number,
): string {
  const { from, to } = pageRange(page, pageSize, total);
  return `${from}-${to} de ${total}`;
}
