import { CARD_GRID_CLASS } from "@/components/ui/CardGrid";
import { Skeleton } from "@/components/ui/Skeleton";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import type { ViewMode } from "@/hooks/useViewMode";
import { PAGE_SIZE } from "@/utils/pagination";

const HEADER_HEIGHT_PX = 41;
const CARD_HEIGHT_PX = 176;

interface ListSkeletonProps {
  view: ViewMode;
  label: string;
  rowHeightPx: number;
}

export function ListSkeleton({ view, label, rowHeightPx }: ListSkeletonProps) {
  return (
    <div aria-busy="true" aria-label={label}>
      <ViewSwitch
        view={view}
        table={
          <Skeleton
            className="w-full rounded-xl"
            style={{ height: HEADER_HEIGHT_PX + PAGE_SIZE * rowHeightPx }}
          />
        }
        cards={
          <div className={CARD_GRID_CLASS}>
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <Skeleton
                key={index}
                className="w-full rounded-xl"
                style={{ height: CARD_HEIGHT_PX }}
              />
            ))}
          </div>
        }
      />
    </div>
  );
}
