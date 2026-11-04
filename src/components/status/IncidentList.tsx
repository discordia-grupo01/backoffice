import { CircleCheck, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StateBox } from "@/components/ui/StateBox";
import type { Incident } from "@/types/status.types";

import { IncidentCard } from "./IncidentCard";

interface IncidentListProps {
  incidents: Incident[];
  onPublish: () => void;
  onResolve: (incident: Incident) => void;
}

export function IncidentList({
  incidents,
  onPublish,
  onResolve,
}: IncidentListProps) {
  const count = incidents.length;
  const publishButton = (
    <Button variant="secondary" size="sm" onClick={onPublish}>
      <Plus size={14} aria-hidden="true" />
      Publicar incidente
    </Button>
  );

  return (
    <Card
      as="section"
      aria-labelledby="active-incidents-title"
      className="rounded-[14px]"
    >
      <header className="border-line flex items-center justify-between gap-3 border-b px-4 py-4 min-[481px]:px-5">
        <div className="min-w-0">
          <h2
            id="active-incidents-title"
            className="flex items-center gap-2 font-semibold"
          >
            Incidentes activos
            {count > 0 ? (
              <span className="bg-warning/15 text-warning-readable rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                {count}
              </span>
            ) : null}
          </h2>
          <p className="text-content-subtle mt-0.5 text-xs">
            Avisos visibles para todos los usuarios.
          </p>
        </div>
        {count > 0 ? <div className="shrink-0">{publishButton}</div> : null}
      </header>

      {count === 0 ? (
        <div className="p-4 min-[481px]:p-5">
          <StateBox
            icon={CircleCheck}
            title="No hay incidentes activos"
            action={<div className="mt-3">{publishButton}</div>}
          >
            Cuando publiques uno, los usuarios lo ven como aviso en la app hasta
            que lo resuelvas.
          </StateBox>
        </div>
      ) : (
        <ul className="divide-line divide-y">
          {incidents.map((incident) => (
            <li key={incident.id}>
              <IncidentCard
                incident={incident}
                onResolve={() => onResolve(incident)}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
