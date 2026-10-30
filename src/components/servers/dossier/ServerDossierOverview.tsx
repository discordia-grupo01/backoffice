import { DossierSectionBlock } from "@/components/dossier/DossierOverview";
import { Fact, FactGrid } from "@/components/ui/Fact";
import { formatInteger } from "@/utils/chartFormat";
import { formatDate } from "@/utils/formatDate";
import type {
  ServerDossierSection,
  ServerDossierSummary,
} from "@/types/servers.types";

import { ServerStatusBadge } from "../ServerStatusBadge";
import {
  SERVER_DOSSIER_SECTION_ORDER,
  SERVER_DOSSIER_SECTIONS,
  ServerDossierItems,
  type ServerDossierItemsProps,
} from "./ServerDossierItems";
import { ServerMessagingChart } from "./ServerMessagingChart";

interface ServerDossierOverviewProps {
  summary: ServerDossierSummary;
  idPrefix: string;
  onSeeAll: (section: ServerDossierSection) => void;
}

export function ServerDossierOverview({
  summary,
  idPrefix,
  onSeeAll,
}: ServerDossierOverviewProps) {
  const { server } = summary;

  return (
    <>
      <FactGrid>
        <Fact label="Estado">
          <ServerStatusBadge server={server} />
        </Fact>
        <Fact label="Fecha de creación">{formatDate(server.created_at)}</Fact>
        <Fact label="Miembros">{formatInteger(server.member_count)}</Fact>
        <Fact label="Dueño">
          <span className="block truncate" title={server.owner_name ?? ""}>
            {server.owner_name ?? "Sin datos"}
          </span>
        </Fact>
      </FactGrid>

      <DossierSectionBlock
        idPrefix={idPrefix}
        section="messaging"
        title="Actividad de mensajería reciente"
      >
        <p className="text-content-muted -mt-1 mb-2 text-xs">
          Mensajes por día en los últimos 7 días
        </p>
        <ServerMessagingChart days={summary.messaging} />
      </DossierSectionBlock>

      {SERVER_DOSSIER_SECTION_ORDER.map((section) => (
        <DossierSectionBlock
          key={section}
          idPrefix={idPrefix}
          section={section}
          title={SERVER_DOSSIER_SECTIONS[section].title}
          empty={SERVER_DOSSIER_SECTIONS[section].empty}
          count={summary.counts[section]}
          shown={summary.latest[section].length}
          onSeeAll={() => onSeeAll(section)}
        >
          <ServerDossierItems
            {...({
              section,
              items: summary.latest[section],
            } as ServerDossierItemsProps)}
          />
        </DossierSectionBlock>
      ))}
    </>
  );
}
