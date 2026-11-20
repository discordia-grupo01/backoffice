"use client";

import { X } from "lucide-react";
import { useId } from "react";

import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import type { IncidentAuthor, ResolvedIncident } from "@/types/status.types";
import { formatDateTime } from "@/utils/formatDate";

import { IncidentServiceTags } from "../IncidentServiceTags";
import { IncidentTypeBadge } from "../IncidentTypeBadge";
import { incidentDurationLabel } from "../utils/statusDisplay";

const SECTION_TITLE_CLASS =
  "text-content-subtle mb-2 text-xs font-semibold tracking-wider uppercase";

interface IncidentDetailDialogProps {
  incident: ResolvedIncident | null;
  onClose: () => void;
}

export function IncidentDetailDialog({
  incident,
  onClose,
}: IncidentDetailDialogProps) {
  const titleId = useId();

  return (
    <Dialog
      open={incident !== null}
      onClose={onClose}
      labelledBy={titleId}
      className="sm:h-fit sm:max-h-[min(100dvh-3rem,46rem)] sm:w-[min(100vw-3rem,40rem)]"
    >
      {incident ? (
        <>
          <header className="border-line flex items-start gap-3 border-b px-5 py-4">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2 pt-0.5">
              <h2
                id={titleId}
                className="font-display min-w-0 text-xl leading-tight font-semibold tracking-tight break-words"
              >
                {incident.title}
              </h2>
              <div className="flex items-center gap-2">
                <IncidentTypeBadge type={incident.platform_status} />
                <Badge tone="success">Resuelto</Badge>
              </div>
            </div>
            <div className="-mr-1">
              <IconButton
                icon={X}
                label="Cerrar detalle"
                showTooltip={false}
                onClick={onClose}
              />
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
            <section>
              <h3 className={SECTION_TITLE_CLASS}>
                Aviso que vieron los usuarios
              </h3>
              <div className="border-line bg-surface-input rounded-xl border px-4 py-3">
                <p className="text-content font-semibold break-words">
                  {incident.title}
                </p>
                <p className="text-content-muted mt-1.5 text-sm leading-relaxed break-words whitespace-pre-line">
                  {incident.description}
                </p>
              </div>
            </section>

            <section>
              <h3 className={SECTION_TITLE_CLASS}>Servicios afectados</h3>
              <div className="flex flex-wrap gap-2">
                <IncidentServiceTags services={incident.affected_services} />
              </div>
            </section>

            <section>
              <h3 className={SECTION_TITLE_CLASS}>Línea de tiempo</h3>
              <ol className="space-y-4">
                <TimelineStep
                  tone="bg-warning"
                  title="Publicado"
                  at={incident.created_at}
                  author={incident.created_by}
                />
                <TimelineStep
                  tone="bg-success"
                  title={`Resuelto después de ${incidentDurationLabel(incident)}`}
                  at={incident.resolved_at}
                  author={incident.resolved_by}
                  isLast
                />
              </ol>
            </section>
          </div>
        </>
      ) : null}
    </Dialog>
  );
}

function TimelineStep({
  tone,
  title,
  at,
  author,
  isLast = false,
}: {
  tone: string;
  title: string;
  at?: string;
  author: IncidentAuthor | null;
  isLast?: boolean;
}) {
  return (
    <li className="relative flex gap-3">
      <span
        aria-hidden="true"
        className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", tone)}
      />
      {isLast ? null : (
        <span
          aria-hidden="true"
          className="bg-line absolute top-5 -bottom-[18px] left-[4.5px] w-px"
        />
      )}
      <div className="min-w-0 text-sm">
        <p className="text-content font-semibold">{title}</p>
        <p className="text-content-muted font-mono text-xs">
          {at ? formatDateTime(at) : "Sin fecha registrada"}
        </p>
        <AuthorLine author={author} />
      </div>
    </li>
  );
}

function AuthorLine({ author }: { author: IncidentAuthor | null }) {
  if (!author) {
    return (
      <p className="text-content-subtle mt-0.5 text-xs">
        No quedó registrado quién lo hizo
      </p>
    );
  }
  if (!author.name && !author.email) {
    return (
      <p className="text-content-subtle mt-0.5 text-xs">
        No encontramos al usuario que lo hizo
      </p>
    );
  }
  return (
    <p className="mt-0.5 min-w-0 truncate text-xs">
      <span className="text-content font-medium">
        {author.name ?? "Sin nombre"}
      </span>
      {author.email ? (
        <span className="text-content-muted font-mono"> ({author.email})</span>
      ) : null}
    </p>
  );
}
