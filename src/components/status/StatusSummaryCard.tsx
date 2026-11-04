import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { serviceLabel } from "@/utils/incidents";
import type { PlatformServiceId, PlatformStatus } from "@/types/status.types";

import {
  unreportedFailuresHeadline,
  unreportedFailuresHint,
} from "./utils/serviceHealth";
import {
  activeIncidentsLabel,
  PLATFORM_STATUS_DISPLAY,
  SERVICE_DOWN_DISPLAY,
  userNoticeLabel,
} from "./utils/statusDisplay";

interface StatusSummaryCardProps {
  status: PlatformStatus;
  activeCount: number;
  unreported: readonly PlatformServiceId[];
  onPublishUnreported: () => void;
}

export function StatusSummaryCard({
  status,
  activeCount,
  unreported,
  onPublishUnreported,
}: StatusSummaryCardProps) {
  const labels = unreported.map(serviceLabel);
  /** Hay servicios caídos sin avisar: es lo único que pide acción, manda sobre el estado publicado. */
  const needsAction = labels.length > 0;
  const display = needsAction
    ? SERVICE_DOWN_DISPLAY
    : PLATFORM_STATUS_DISPLAY[status];
  const isAlert = needsAction || status !== "operational";

  return (
    <section
      aria-labelledby="platform-status-title"
      className={cn("overflow-hidden rounded-[14px] border", display.surface)}
    >
      <div className="flex flex-col gap-4 px-4 py-4 min-[481px]:px-5 @2xl:flex-row @2xl:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <span
            aria-hidden="true"
            className="relative mt-1.5 flex size-3 shrink-0"
          >
            {isAlert ? (
              <span
                className={cn(
                  "absolute inset-0 animate-ping rounded-full opacity-40 [animation-duration:2.4s] motion-reduce:hidden",
                  display.solid,
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative size-3 rounded-full ring-4",
                display.solid,
                display.ring,
              )}
            />
          </span>
          <div className="min-w-0">
            <h2
              id="platform-status-title"
              className={cn(
                "font-display text-base leading-snug font-semibold",
                display.text,
              )}
            >
              {needsAction
                ? unreportedFailuresHeadline(labels)
                : PLATFORM_STATUS_DISPLAY[status].headline}
            </h2>
            <p className="text-content-muted mt-0.5 text-[13px] leading-snug">
              {needsAction
                ? unreportedFailuresHint(activeCount)
                : `${activeIncidentsLabel(activeCount)}. ${userNoticeLabel(activeCount)}`}
            </p>
          </div>
        </div>
        {needsAction ? (
          <PublishUnreportedButton onClick={onPublishUnreported} />
        ) : null}
      </div>
    </section>
  );
}

function PublishUnreportedButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="self-start @2xl:self-center"
      onClick={onClick}
    >
      Publicar incidente
    </Button>
  );
}
