import { parseIsoDate } from "@/utils/metricsPeriod";

/** `2023-03-12` -> `12/03/2023`. */
export function formatDate(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
