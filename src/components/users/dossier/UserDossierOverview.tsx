import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatDate, formatDateTime } from "@/utils/formatDate";
import type { DossierSection, UserDossierSummary } from "@/types/users.types";

import {
  DOSSIER_SECTION_ORDER,
  DOSSIER_SECTIONS,
  DossierItems,
  type DossierItemsProps,
} from "./UserDossierItems";
import { UserStatusBadge } from "../UserStatusBadge";

export function seeAllButtonId(idPrefix: string, section: DossierSection) {
  return `${idPrefix}-see-all-${section}`;
}

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

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-3">
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
      </dl>

      {DOSSIER_SECTION_ORDER.map((section) => {
        const { title, empty } = DOSSIER_SECTIONS[section];
        const count = summary.counts[section];
        const headingId = `${idPrefix}-heading-${section}`;
        const items = {
          section,
          items: summary.latest[section],
        } as DossierItemsProps;

        return (
          <section key={section} aria-labelledby={headingId}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h3 id={headingId} className="font-display text-sm font-semibold">
                {title}{" "}
                <span className="text-content-muted font-sans font-medium tabular-nums">
                  ({count})
                </span>
              </h3>
              {count > summary.latest[section].length ? (
                <button
                  id={seeAllButtonId(idPrefix, section)}
                  type="button"
                  onClick={() => onSeeAll(section)}
                  aria-label={`Ver todos: ${title}`}
                  className="focus-visible:ring-bo -mr-1 shrink-0 cursor-pointer rounded-md px-1 py-0.5 text-[13px] font-semibold text-[color-mix(in_srgb,var(--bo-accent)_65%,var(--text))] hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  Ver todos
                </button>
              ) : null}
            </div>

            {count === 0 ? (
              <p className="border-line bg-surface-input text-content-muted rounded-xl border px-4 py-3 text-sm">
                {empty}
              </p>
            ) : (
              <DossierItems {...items} />
            )}
          </section>
        );
      })}
    </div>
  );
}

function Fact({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-line bg-surface-input min-w-0 rounded-xl border px-4 py-3",
        className,
      )}
    >
      <dt className="text-content-muted text-xs">{label}</dt>
      <dd className="mt-1 min-w-0 text-sm font-medium tabular-nums">
        {children}
      </dd>
    </div>
  );
}

export function UserDossierOverviewSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando expediente"
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-[66px] rounded-xl" />
        <Skeleton className="h-[66px] rounded-xl" />
        <Skeleton className="h-[66px] rounded-xl" />
        <Skeleton className="h-[66px] rounded-xl" />
      </div>
      {DOSSIER_SECTION_ORDER.map((section) => (
        <div key={section} className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-[166px] w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}
