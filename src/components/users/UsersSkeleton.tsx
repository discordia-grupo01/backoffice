import { CARD_GRID_CLASS } from "@/components/ui/CardGrid";
import { Skeleton } from "@/components/ui/Skeleton";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import type { ViewMode } from "@/hooks/useViewMode";
import { PAGE_SIZE } from "@/utils/pagination";

/** Alto aproximado del encabezado y de una fila de `UsersTable`, para que la carga ocupe lo mismo que la tabla. */
const HEADER_HEIGHT_PX = 41;
const ROW_HEIGHT_PX = 61;

export function UsersSkeleton({ view }: { view: ViewMode }) {
  return (
    <div aria-busy="true" aria-label="Cargando usuarios">
      <ViewSwitch
        view={view}
        table={
          <Skeleton
            className="w-full rounded-xl"
            style={{ height: HEADER_HEIGHT_PX + PAGE_SIZE * ROW_HEIGHT_PX }}
          />
        }
        cards={
          <div className={CARD_GRID_CLASS}>
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <Skeleton key={index} className="h-[176px] w-full rounded-xl" />
            ))}
          </div>
        }
      />
    </div>
  );
}
