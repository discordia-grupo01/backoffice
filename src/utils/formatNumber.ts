/** `182400` -> `182.400` (formato de Argentina). */
export function formatMembers(count: number): string {
  return count.toLocaleString("es-AR");
}
