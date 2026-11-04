import { Check } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Incident } from "@/types/status.types";
import { formatDateTime } from "@/utils/formatDate";
import { serviceLabel } from "@/utils/incidents";

import { formatSince, INCIDENT_TYPE_DISPLAY } from "./utils/statusDisplay";

interface IncidentCardProps {
  incident: Incident;
  onResolve: () => void;
}

export function IncidentCard({ incident, onResolve }: IncidentCardProps) {
  const type = INCIDENT_TYPE_DISPLAY[incident.platform_status];

  return (
    <article className="flex gap-4 p-4 min-[481px]:p-5">
      <span
        aria-hidden="true"
        className={cn("w-1 shrink-0 self-stretch rounded-full", type.solid)}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-4 @2xl:flex-row @2xl:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-content font-semibold break-words">
              {incident.title}
            </h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
                type.soft,
              )}
            >
              {type.label}
            </span>
          </div>
          <p
            className="text-content-muted mt-2 line-clamp-2 text-sm leading-relaxed break-words"
            title={incident.description}
          >
            {incident.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {incident.affected_services.map((service) => (
              <span
                key={service}
                className="bg-surface-input text-content-muted rounded-md px-2 py-1 text-xs"
              >
                {serviceLabel(service)}
              </span>
            ))}
            <time
              dateTime={incident.created_at}
              title={formatDateTime(incident.created_at)}
              className="text-content-subtle text-xs"
            >
              Creado {formatSince(incident.created_at)}
            </time>
          </div>
        </div>
        <Button
          variant="positive"
          size="sm"
          className="self-start"
          onClick={onResolve}
        >
          <Check size={14} aria-hidden="true" />
          Marcar como resuelto
        </Button>
      </div>
    </article>
  );
}
