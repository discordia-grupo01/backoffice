import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { PLATFORM_SERVICES, serviceLabel } from "@/utils/incidents";
import type {
  PlatformServiceId,
  ServiceHealthCheck,
  ServiceHealthState,
} from "@/types/status.types";

import { checkedAgoLabel, SERVICE_HEALTH_DISPLAY } from "./utils/serviceHealth";

const GRID_CLASS = "grid grid-cols-1 gap-3 @xl:grid-cols-2 @5xl:grid-cols-3";

interface ServiceHealthPanelProps {
  state: ServiceHealthState;
  unreported: readonly PlatformServiceId[];
}

export function ServiceHealthPanel({
  state,
  unreported,
}: ServiceHealthPanelProps) {
  return (
    <Card
      as="section"
      aria-labelledby="service-health-title"
      className="rounded-[14px]"
    >
      <header className="border-line flex items-start justify-between gap-3 border-b px-4 py-4 min-[481px]:px-5">
        <div>
          <h2 id="service-health-title" className="font-semibold">
            Salud de los servicios
          </h2>
          <p className="text-content-subtle mt-0.5 text-xs">
            Resultado de los health checks internos.
          </p>
        </div>
        <Badge tone="neutral">Actualizado en vivo</Badge>
      </header>

      <div className="p-4 min-[481px]:p-5">
        {state.phase === "loading" ? (
          <div className={GRID_CLASS}>
            {PLATFORM_SERVICES.map((service) => (
              <Skeleton key={service.id} className="h-[76px] rounded-xl" />
            ))}
          </div>
        ) : state.phase === "error" ? (
          <p className="text-content-muted text-sm">{state.message}</p>
        ) : (
          <ul className={GRID_CLASS}>
            {state.checks.map((check) => (
              <li key={check.service}>
                <ServiceHealthCard
                  check={check}
                  needsIncident={unreported.includes(check.service)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

interface ServiceHealthCardProps {
  check: ServiceHealthCheck;
  needsIncident: boolean;
}

function ServiceHealthCard({ check, needsIncident }: ServiceHealthCardProps) {
  const display = SERVICE_HEALTH_DISPLAY[check.health];

  return (
    <div
      className={cn(
        "bg-surface-input h-full rounded-xl border px-4 py-3",
        needsIncident ? "border-danger/40" : "border-line",
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="truncate text-sm font-semibold">
          {serviceLabel(check.service)}
        </p>
        {needsIncident ? (
          <span className="text-danger-readable shrink-0 text-xs">
            Incidente no publicado
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex h-6 items-center justify-between gap-2">
        <Badge tone={display.tone}>{display.label}</Badge>
        <span className="text-content-subtle text-xs whitespace-nowrap tabular-nums">
          Verificado {checkedAgoLabel(check.checked_at)}
        </span>
      </div>
    </div>
  );
}
