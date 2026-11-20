import { cn } from "@/lib/cn";
import type { IncidentType } from "@/types/status.types";

import { INCIDENT_TYPE_DISPLAY } from "./utils/statusDisplay";

export function IncidentTypeBadge({ type }: { type: IncidentType }) {
  const display = INCIDENT_TYPE_DISPLAY[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        display.soft,
      )}
    >
      {display.label}
    </span>
  );
}
