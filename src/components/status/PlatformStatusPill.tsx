import { cn } from "@/lib/cn";
import type { PlatformStatus } from "@/types/status.types";

import { PLATFORM_STATUS_DISPLAY } from "./utils/statusDisplay";

export function PlatformStatusPill({ status }: { status: PlatformStatus }) {
  const display = PLATFORM_STATUS_DISPLAY[status];

  return (
    <span
      className={cn(
        "hidden items-center gap-2 rounded-lg border border-current/30 px-3 py-1.5 text-xs font-semibold whitespace-nowrap sm:inline-flex",
        display.soft,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-2 rounded-full", display.solid)}
      />
      {display.headline}
    </span>
  );
}
