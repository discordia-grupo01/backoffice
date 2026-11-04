import { CircleCheck, Plus, TriangleAlert, Wrench } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { PlatformStatus } from "@/types/status.types";

import {
  activeIncidentsLabel,
  PLATFORM_STATUS_DISPLAY,
} from "./utils/statusDisplay";

const ICONS = {
  operational: CircleCheck,
  degraded: TriangleAlert,
  maintenance: Wrench,
} as const;

interface StatusSummaryCardProps {
  status: PlatformStatus;
  activeCount: number;
  onPublish: () => void;
}

export function StatusSummaryCard({
  status,
  activeCount,
  onPublish,
}: StatusSummaryCardProps) {
  const display = PLATFORM_STATUS_DISPLAY[status];
  const Icon = ICONS[status];

  return (
    <Card
      as="section"
      aria-labelledby="platform-status-title"
      className="flex flex-col gap-4 rounded-[14px] p-4 min-[481px]:p-5 @2xl:flex-row @2xl:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            display.soft,
          )}
        >
          <Icon size={22} />
        </span>
        <div className="min-w-0">
          <h2
            id="platform-status-title"
            className="text-content-subtle text-xs font-semibold tracking-wider uppercase"
          >
            Estado actual de la plataforma
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={cn(
                "font-display rounded-full px-3 py-1 text-base font-bold",
                display.soft,
              )}
            >
              {display.label}
            </span>
            <span className="text-content-muted text-sm">
              {activeIncidentsLabel(activeCount)}
            </span>
          </div>
        </div>
      </div>
      <Button className="@2xl:w-auto @2xl:px-5" onClick={onPublish}>
        <Plus size={16} aria-hidden="true" />
        Publicar incidente
      </Button>
    </Card>
  );
}
