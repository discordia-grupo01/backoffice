import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export interface Column<T> {
  header: string;
  /** Ancho fijo (ej. `7.5rem`); la columna sin ancho se queda con lo que sobra. */
  width?: string;
  align?: "left" | "right";
  cell: (row: T) => ReactNode;
  /** Clases extra de la celda (tipografía, truncado). */
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: readonly Column<T>[];
  rows: readonly T[];
  getRowKey: (row: T) => string;
  /** Clase de ancho mínimo (ej. `min-w-[760px]`) antes de que aparezca el scroll horizontal. */
  minWidthClass?: string;
}

/** Tabla de un listado del panel: columnas de ancho fijo, encabezado y una fila por elemento. */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  minWidthClass,
}: DataTableProps<T>) {
  return (
    <Card className="overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className={cn("w-full table-fixed text-sm", minWidthClass)}>
          <colgroup>
            {columns.map(({ header, width }) => (
              <col key={header} style={width ? { width } : undefined} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-surface-sunken">
              {columns.map(({ header, align }) => (
                <th
                  key={header}
                  scope="col"
                  className={cn(
                    "text-content-subtle px-4 py-3 text-xs font-semibold tracking-wider uppercase",
                    align === "right" ? "text-right" : "text-left",
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="border-line border-t">
                {columns.map(({ header, align, cell, cellClassName }) => (
                  <td
                    key={header}
                    className={cn(
                      "px-4 py-3",
                      align === "right" && "text-right",
                      cellClassName,
                    )}
                  >
                    {cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
