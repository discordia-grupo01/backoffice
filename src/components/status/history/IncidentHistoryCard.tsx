import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Fact, FactGrid } from "@/components/ui/Fact";
import type { ResolvedIncident } from "@/types/status.types";
import { formatDateTime } from "@/utils/formatDate";

import { IncidentServiceTags } from "../IncidentServiceTags";
import { IncidentTypeBadge } from "../IncidentTypeBadge";
import { incidentDurationLabel } from "../utils/statusDisplay";

const VISIBLE_SERVICES = 2;

interface IncidentHistoryCardProps {
  incident: ResolvedIncident;
  onOpen: (incident: ResolvedIncident) => void;
}

export function IncidentHistoryCard({
  incident,
  onOpen,
}: IncidentHistoryCardProps) {
  const services = incident.affected_services;
  const hiddenServices = services.length - VISIBLE_SERVICES;

  return (
    <Card as="article" className="flex h-full flex-col gap-4 rounded-xl p-5">
      <div className="flex h-6 items-center gap-2 overflow-hidden">
        <IncidentTypeBadge type={incident.platform_status} />
        <IncidentServiceTags services={services.slice(0, VISIBLE_SERVICES)} />
        {hiddenServices > 0 ? (
          <span className="bg-surface-input text-content-muted shrink-0 rounded-md px-2 py-1 text-xs">
            +{hiddenServices}
          </span>
        ) : null}
      </div>

      <div className="min-w-0">
        <h3 className="text-content truncate font-semibold">
          {incident.title}
        </h3>
        <p className="text-content-muted mt-1 truncate text-sm leading-relaxed">
          {incident.description}
        </p>
      </div>

      <FactGrid className="border-line border-t pt-4">
        <Fact label="Inicio" boxed={false}>
          <span className="font-mono text-xs">
            {formatDateTime(incident.created_at)}
          </span>
        </Fact>
        <Fact label="Duración" boxed={false}>
          {incidentDurationLabel(incident)}
        </Fact>
      </FactGrid>

      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        aria-label={`Ver el detalle de ${incident.title}`}
        onClick={() => onOpen(incident)}
      >
        Ver detalle
      </Button>
    </Card>
  );
}
