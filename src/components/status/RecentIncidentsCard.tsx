import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/utils/formatDate";

import {
  RECENT_LIMIT,
  type RecentIncidentsState,
} from "./history/hooks/useRecentIncidents";
import { IncidentTypeBadge } from "./IncidentTypeBadge";
import { incidentDurationLabel } from "./utils/statusDisplay";

interface RecentIncidentsCardProps {
  state: RecentIncidentsState;
  onRetry: () => void;
}

export function RecentIncidentsCard({
  state,
  onRetry,
}: RecentIncidentsCardProps) {
  return (
    <Card
      as="section"
      aria-labelledby="recent-incidents-title"
      className="rounded-[14px]"
    >
      <header className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-4 py-4 min-[481px]:px-5">
        <div className="min-w-0">
          <h2 id="recent-incidents-title" className="font-semibold">
            Historial reciente
          </h2>
          <p className="text-content-subtle mt-0.5 text-xs">
            Últimos incidentes resueltos.
          </p>
        </div>
        <Link
          href={ROUTES.statusHistory}
          className="focus-visible:ring-bo inline-flex items-center gap-1 rounded-md text-[13px] font-semibold text-[color-mix(in_srgb,var(--bo-accent)_65%,var(--text))] hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          Ver historial completo
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </header>

      <RecentIncidentsBody state={state} onRetry={onRetry} />
    </Card>
  );
}

function RecentIncidentsBody({ state, onRetry }: RecentIncidentsCardProps) {
  if (state.phase === "loading") {
    return (
      <div
        aria-busy="true"
        aria-label="Cargando historial reciente"
        className="space-y-2 p-4 min-[481px]:px-5"
      >
        {Array.from({ length: RECENT_LIMIT }, (_, index) => (
          <Skeleton key={index} className="h-9 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (state.phase === "error") {
    return (
      <div
        role="alert"
        className="text-content-muted flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm min-[481px]:px-5"
      >
        No pudimos cargar el historial reciente.
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (state.incidents.length === 0) {
    return (
      <p className="text-content-muted px-4 py-4 text-sm min-[481px]:px-5">
        Todavía no hay incidentes resueltos.
      </p>
    );
  }

  return (
    <ul className="divide-line divide-y">
      {state.incidents.map((incident) => (
        <li
          key={incident.id}
          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 px-4 py-3 text-sm min-[481px]:px-5"
        >
          <time
            dateTime={incident.created_at}
            title={formatDateTime(incident.created_at)}
            className="text-content-subtle font-mono text-xs"
          >
            {formatDate(incident.created_at)}
          </time>
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className="text-content truncate font-semibold"
              title={incident.title}
            >
              {incident.title}
            </span>
            <IncidentTypeBadge type={incident.platform_status} />
          </div>
          <span className="text-content-muted text-xs whitespace-nowrap tabular-nums">
            {incidentDurationLabel(incident)}
          </span>
        </li>
      ))}
    </ul>
  );
}
