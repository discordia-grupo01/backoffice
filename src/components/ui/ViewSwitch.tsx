import type { ReactNode } from "react";

import type { ViewMode } from "@/hooks/useViewMode";
import { cn } from "@/lib/cn";

interface ViewSwitchProps {
  view: ViewMode;
  table: ReactNode;
  cards: ReactNode;
}

/**
 * Muestra la tabla o las tarjetas según la vista elegida. La tabla solo se ve
 * en pantallas anchas: en angostas siempre se muestran las tarjetas.
 */
export function ViewSwitch({ view, table, cards }: ViewSwitchProps) {
  return (
    <>
      {view === "table" ? (
        <div className="hidden @3xl:block">{table}</div>
      ) : null}
      <div className={cn(view === "table" && "@3xl:hidden")}>{cards}</div>
    </>
  );
}
