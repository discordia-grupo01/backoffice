import { pageRange } from "@discordia/client-shared";

/** Elementos por página en los listados del panel. 12 se reparte exacto en 1, 2 y 3 columnas de tarjetas: la grilla nunca termina con una fila incompleta. */
export const PAGE_SIZE = 12;

/** Elementos por página en los listados del expediente, que son de una sola columna. */
export const DOSSIER_PAGE_SIZE = 10;

/** Tope de `limit` que aceptan los endpoints de listado del back. */
export const MAX_PAGE_SIZE = 100;

/** Largo máximo de la búsqueda que acepta el back. */
export const SEARCH_MAX_LENGTH = 100;

export function offsetOfPage(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

export function totalLabel(total: number): string {
  return `${total} ${total === 1 ? "resultado" : "resultados"}`;
}

export function rangeLabel(
  page: number,
  pageSize: number,
  total: number,
): string {
  const { from, to } = pageRange(page, pageSize, total);
  return `${from}-${to} de ${total}`;
}
