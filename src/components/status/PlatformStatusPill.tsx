"use client";

import { usePlatformStatusContext } from "@/contexts/PlatformStatusContext";
import { cn } from "@/lib/cn";

import {
  findUnreportedFailures,
  servicesDownLabel,
} from "./utils/serviceHealth";
import {
  PLATFORM_STATUS_DISPLAY,
  SERVICE_DOWN_DISPLAY,
} from "./utils/statusDisplay";

export function PlatformStatusPill() {
  const { platform, health } = usePlatformStatusContext();
  if (!platform || health.phase === "loading") return null;

  const unreported =
    health.phase === "ready"
      ? findUnreportedFailures(health.checks, platform.incidents)
      : [];
  const needsAction = unreported.length > 0;
  const display = needsAction
    ? SERVICE_DOWN_DISPLAY
    : PLATFORM_STATUS_DISPLAY[platform.status];
  const label = needsAction
    ? servicesDownLabel(unreported.length)
    : PLATFORM_STATUS_DISPLAY[platform.status].headline;

  return (
    <span
      role="status"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-current/30 px-2.5 py-2 text-xs font-semibold whitespace-nowrap sm:px-3 sm:py-1.5",
        display.soft,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", display.solid)}
      />
      <span aria-hidden="true" className="hidden sm:inline">
        {label}
      </span>
    </span>
  );
}
