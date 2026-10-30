import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Grilla de datos `Fact`. Por defecto en dos columnas. */
export function FactGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <dl className={cn("grid grid-cols-2 gap-3", className)}>{children}</dl>
  );
}

/**
 * Un dato: la etiqueta arriba y el valor abajo. Va dentro de `FactGrid`.
 * Sin recuadro cuando ya está dentro de otra caja, como una card.
 */
export function Fact({
  label,
  boxed = true,
  children,
}: {
  label: string;
  boxed?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "min-w-0",
        boxed && "border-line bg-surface-input rounded-xl border px-4 py-3",
      )}
    >
      <dt className="text-content-muted text-xs">{label}</dt>
      <dd className="mt-1 min-w-0 text-sm font-medium tabular-nums">
        {children}
      </dd>
    </div>
  );
}
