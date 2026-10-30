import { DossierSectionBlock } from "@/components/dossier/DossierOverview";
import { Fact, FactGrid } from "@/components/ui/Fact";
import { formatDate, formatDateTime } from "@/utils/formatDate";
import type { DossierSection, UserDossierSummary } from "@/types/users.types";

import { UserStatusBadge } from "../UserStatusBadge";
import {
  USER_DOSSIER_SECTION_ORDER,
  USER_DOSSIER_SECTIONS,
  UserDossierItems,
  type UserDossierItemsProps,
} from "./UserDossierItems";

interface UserDossierOverviewProps {
  summary: UserDossierSummary;
  idPrefix: string;
  onSeeAll: (section: DossierSection) => void;
}

/** Resumen del expediente de usuario: datos de la cuenta y lo más reciente de cada sección. */
export function UserDossierOverview({
  summary,
  idPrefix,
  onSeeAll,
}: UserDossierOverviewProps) {
  const { user } = summary;

  return (
    <>
      <FactGrid>
        <Fact label="Estado de cuenta">
          <UserStatusBadge status={user.status} />
        </Fact>
        <Fact label="Fecha de registro">{formatDate(user.created_at)}</Fact>
        <Fact label="Email">
          <span className="block truncate" title={user.email}>
            {user.email}
          </span>
        </Fact>
        <Fact label="Última actividad">
          {summary.last_activity_at
            ? formatDateTime(summary.last_activity_at)
            : "Sin actividad"}
        </Fact>
      </FactGrid>

      {USER_DOSSIER_SECTION_ORDER.map((section) => (
        <DossierSectionBlock
          key={section}
          idPrefix={idPrefix}
          section={section}
          title={USER_DOSSIER_SECTIONS[section].title}
          empty={USER_DOSSIER_SECTIONS[section].empty}
          count={summary.counts[section]}
          shown={summary.latest[section].length}
          onSeeAll={() => onSeeAll(section)}
        >
          <UserDossierItems
            {...({
              section,
              items: summary.latest[section],
            } as UserDossierItemsProps)}
          />
        </DossierSectionBlock>
      ))}
    </>
  );
}
