/** `2023-03-12T15:04:05Z` -> `12/03/2023` (hora local de quien mira). */
export function formatDate(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
