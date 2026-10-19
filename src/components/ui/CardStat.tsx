import type { ReactNode } from "react";

/** Un dato de una tarjeta: el valor arriba y su etiqueta abajo. Va dentro de un `<dl>`. */
export function CardStat({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse items-start">
      <dt className="text-content-muted mt-0.5 text-xs">{label}</dt>
      <dd className="font-mono text-base font-bold tabular-nums">{children}</dd>
    </div>
  );
}
