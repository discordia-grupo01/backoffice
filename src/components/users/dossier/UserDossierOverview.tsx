import { KeyRound } from "lucide-react";
import Link from "next/link";

import {
  DossierSectionBlock,
  DossierSuspendedNotice,
} from "@/components/dossier/DossierOverview";
import { Fact, FactGrid } from "@/components/ui/Fact";
import { formatDate, formatDateTime } from "@/utils/formatDate";
import { recoveryRequestHref } from "@/utils/recoveryRequestHref";
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

export function UserDossierOverview({
  summary,
  idPrefix,
  onSeeAll,
}: UserDossierOverviewProps) {
  const { user } = summary;
  const latestRecovery = summary.latest.recovery_requests[0];

  return (
    <>
      {latestRecovery?.status === "pending" ? (
        <PendingRecoveryNotice requestId={latestRecovery.id} />
      ) : null}

      <DossierSuspendedNotice
        label="Cuenta suspendida"
        suspendedAt={user.suspended_at}
      />

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

function PendingRecoveryNotice({ requestId }: { requestId: string }) {
  return (
    <div className="border-warning/30 bg-warning/10 text-warning-readable flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm sm:flex-row sm:items-center">
      <p className="flex flex-1 items-center gap-3">
        <KeyRound aria-hidden className="size-4 shrink-0" />
        Este usuario tiene una solicitud de recuperación pendiente
      </p>
      <Link
        href={recoveryRequestHref(requestId)}
        className="focus-visible:ring-bo shrink-0 rounded-md text-[13px] font-semibold hover:underline focus-visible:ring-2 focus-visible:outline-none"
      >
        Revisar solicitud
      </Link>
    </div>
  );
}
