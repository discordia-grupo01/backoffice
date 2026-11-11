"use client";

import { AlertTriangle, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatInteger, formatSeriesTooltipLabel } from "@/utils/chartFormat";
import { parseIsoDate } from "@/utils/metricsPeriod";
import type { MetricsPeriod, ServerGrowthPoint } from "@/types/metrics.types";

import { useServerGrowth } from "./hooks/useServerGrowth";
import { MemberGrowthChart } from "./MemberGrowthChart";
import { summarizeGrowth } from "./memberGrowthSummary";

interface MemberGrowthCardProps {
  serverId: string;
  period: MetricsPeriod | null;
}

export function MemberGrowthCard({ serverId, period }: MemberGrowthCardProps) {
  const { status, growth, retry } = useServerGrowth(serverId, period);
  const headingId = useId();

  if (!period || status === "forbidden") return null;
  if (status === "loading") {
    return (
      <div aria-busy="true" aria-label="Cargando el crecimiento de miembros">
        <Skeleton className="h-[296px] rounded-xl" />
      </div>
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      className="border-line bg-surface-input rounded-xl border p-4"
    >
      <h3 id={headingId} className="text-sm font-semibold">
        Crecimiento de miembros
      </h3>
      <p className="text-content-muted mt-0.5 text-xs">
        Miembros del servidor al cierre de cada día.
      </p>

      {status === "error" || !growth ? (
        <GrowthError onRetry={retry} />
      ) : (
        <GrowthBody points={growth.points} />
      )}
    </section>
  );
}

function GrowthBody({ points }: { points: ServerGrowthPoint[] }) {
  const summary = summarizeGrowth(points);
  if (!summary) {
    return (
      <p className="text-content-muted mt-4 text-xs">
        No hay datos de miembros para este período.
      </p>
    );
  }

  return (
    <>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tabular-nums">
            {formatInteger(summary.members)}
          </span>
          <span className="text-content-muted text-sm">miembros</span>
        </p>
        {summary.change !== null ? (
          <GrowthChange change={summary.change} since={summary.since} />
        ) : null}
      </div>

      {points.length > 1 ? (
        <>
          <div aria-hidden="true" className="mt-3 -ml-2 h-48">
            <MemberGrowthChart points={points} />
          </div>
          <GrowthTable points={points} />
        </>
      ) : (
        <p className="text-content-muted mt-2 text-xs">
          Elegí un período más largo para ver la evolución.
        </p>
      )}
    </>
  );
}

function shortDate(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

function GrowthChange({ change, since }: { change: number; since: string }) {
  const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const amount = formatInteger(Math.abs(change));
  const text =
    change > 0
      ? `${amount} más`
      : change < 0
        ? `${amount} menos`
        : "Sin cambios";

  return (
    <p
      className={cn(
        "flex items-center gap-1 text-xs font-semibold tabular-nums",
        change > 0 && "text-success-readable",
        change < 0 && "text-danger-readable",
        change === 0 && "text-content-muted",
      )}
    >
      <Icon size={14} aria-hidden="true" />
      {text} desde el {shortDate(since)}
    </p>
  );
}

function GrowthTable({ points }: { points: ServerGrowthPoint[] }) {
  return (
    <div className="sr-only">
      <table>
        <caption>Miembros del servidor al cierre de cada día</caption>
        <thead>
          <tr>
            <th scope="col">Día</th>
            <th scope="col">Miembros</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.date}>
              <td>{formatSeriesTooltipLabel(point.date, "day")}</td>
              <td>{formatInteger(point.members)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GrowthError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="text-content-muted mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs"
    >
      <AlertTriangle size={16} aria-hidden="true" />
      <span>No pudimos cargar el crecimiento de miembros.</span>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}
