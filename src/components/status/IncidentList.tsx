import { CircleCheck } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { Incident } from "@/types/status.types";

import { IncidentCard } from "./IncidentCard";

interface IncidentListProps {
  incidents: Incident[];
  onResolve: (incident: Incident) => void;
}

export function IncidentList({ incidents, onResolve }: IncidentListProps) {
  const count = incidents.length;

  return (
    <Card
      as="section"
      aria-labelledby="active-incidents-title"
      className="rounded-[14px]"
    >
      <header className="border-line flex items-center justify-between gap-3 border-b px-4 py-4 min-[481px]:px-5">
        <div>
          <h2 id="active-incidents-title" className="font-semibold">
            Incidentes activos
          </h2>
          <p className="text-content-subtle mt-0.5 text-xs">
            Avisos visibles para todos los usuarios.
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
            count > 0
              ? "bg-warning/15 text-warning-readable"
              : "bg-success/15 text-success-readable",
          )}
        >
          {count}
        </span>
      </header>

      {count === 0 ? (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <span
            aria-hidden="true"
            className="bg-success/15 text-success-readable mb-4 flex size-12 items-center justify-center rounded-full"
          >
            <CircleCheck size={22} />
          </span>
          <p className="text-sm font-semibold">No hay incidentes activos</p>
          <p className="text-content-muted mt-1 text-sm">
            La plataforma está operativa.
          </p>
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
