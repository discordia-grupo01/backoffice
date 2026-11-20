import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import type { ResolvedIncident } from "@/types/status.types";
import { formatDateTime } from "@/utils/formatDate";
import { serviceLabel } from "@/utils/incidents";

import { IncidentTypeBadge } from "../IncidentTypeBadge";
import { incidentDurationLabel } from "../utils/statusDisplay";

interface IncidentHistoryTableProps {
  incidents: readonly ResolvedIncident[];
  onOpen: (incident: ResolvedIncident) => void;
}

export function IncidentHistoryTable({
  incidents,
  onOpen,
}: IncidentHistoryTableProps) {
  const columns: Column<ResolvedIncident>[] = [
    {
      header: "Incidente",
      cell: (incident) => (
        <div className="min-w-0">
          <p
            className="text-content truncate font-semibold"
            title={incident.title}
          >
            {incident.title}
          </p>
          <p
            className="text-content-subtle truncate text-xs"
            title={incident.description}
          >
            {incident.description}
          </p>
        </div>
      ),
    },
    {
      header: "Servicios",
      width: "12rem",
      cellClassName: "text-content-muted text-xs",
      cell: (incident) => {
        const services = incident.affected_services
          .map(serviceLabel)
          .join(", ");
        return (
          <p className="line-clamp-2" title={services}>
            {services}
          </p>
        );
      },
    },
    {
      header: "Tipo",
      width: "9rem",
      cell: (incident) => <IncidentTypeBadge type={incident.platform_status} />,
    },
    {
      header: "Inicio",
      width: "9.5rem",
      cellClassName: "font-mono text-xs",
      cell: (incident) => formatDateTime(incident.created_at),
    },
    {
      header: "Duración",
      width: "10rem",
      align: "right",
      cellClassName: "font-semibold tabular-nums whitespace-nowrap",
      cell: incidentDurationLabel,
    },
    {
      header: "Acciones",
      width: "8.5rem",
      cell: (incident) => (
        <Button
          variant="secondary"
          size="sm"
          className="whitespace-nowrap"
          aria-label={`Ver el detalle de ${incident.title}`}
          onClick={() => onOpen(incident)}
        >
          Ver detalle
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={incidents}
      getRowKey={(incident) => incident.id}
      minWidthClass="min-w-[960px]"
    />
  );
}
