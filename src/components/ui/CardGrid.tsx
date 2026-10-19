import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Grilla de tarjetas de 1, 2 o 3 columnas según el ancho del panel. */
export const CARD_GRID_CLASS =
  "grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3";

export function CardGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <ul className={cn(CARD_GRID_CLASS, className)}>{children}</ul>;
}
