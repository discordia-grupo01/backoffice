import { CardGrid } from "@/components/ui/CardGrid";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import type { ViewMode } from "@/hooks/useViewMode";
import type { ResolvedIncident } from "@/types/status.types";

import { IncidentHistoryCard } from "./IncidentHistoryCard";
import { IncidentHistoryTable } from "./IncidentHistoryTable";

interface IncidentHistoryListProps {
  incidents: readonly ResolvedIncident[];
  view: ViewMode;
  onOpen: (incident: ResolvedIncident) => void;
}

export function IncidentHistoryList({
  incidents,
  view,
  onOpen,
}: IncidentHistoryListProps) {
  return (
    <ViewSwitch
      view={view}
      table={<IncidentHistoryTable incidents={incidents} onOpen={onOpen} />}
      cards={
        <CardGrid>
          {incidents.map((incident) => (
            <li key={incident.id}>
              <IncidentHistoryCard incident={incident} onOpen={onOpen} />
            </li>
          ))}
        </CardGrid>
      }
    />
  );
}
