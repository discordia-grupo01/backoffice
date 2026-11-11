"use client";

import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import { ChartCard } from "@/components/metrics/ChartCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { TimeAreaChart } from "@/components/ui/TimeAreaChart";
import { formatInteger, formatSeriesTooltipLabel } from "@/utils/chartFormat";
import { formatDate } from "@/utils/formatDate";
import { parseIsoDate, toIsoDate } from "@/utils/metricsPeriod";
import type { MetricsPeriod, ServerGrowthPoint } from "@/types/metrics.types";

import { useServerGrowth } from "./hooks/useServerGrowth";

const TITLE = "Crecimiento de miembros";
const SUBTITLE = "Miembros del servidor al cierre de cada día";

interface MemberGrowthCardProps {
  serverId: string;
  /** Período ya validado; nulo mientras el personalizado sea inválido. */
  period: MetricsPeriod | null;
  /** Falso cuando arriba ya se pide un período más amplio. */
  showPeriodHint?: boolean;
}

export function MemberGrowthCard({
  serverId,
  period,
  showPeriodHint = true,
}: MemberGrowthCardProps) {
  const { status, growth, retry } = useServerGrowth(serverId, period);

  if (!period || status === "forbidden") return null;
  if (status === "loading") {
    return (
      <div aria-busy="true" aria-label="Cargando el crecimiento de miembros">
        <Skeleton className="h-[340px] rounded-xl" />
      </div>
    );
  }

  const drawsChart =
    status === "success" && !!growth && growth.points.length > 1;
  const singleDay =
    status === "success" && growth?.points.length === 1
      ? growth.points[0]
      : undefined;

  return (
    <ChartCard
      inset
      compact={!drawsChart}
      title={TITLE}
      subtitle={singleDay ? singleDaySubtitle(singleDay.date) : SUBTITLE}
    >
      {status === "error" || !growth ? (
        <GrowthMessage>
          <AlertTriangle size={16} aria-hidden="true" />
          <span>No pudimos cargar el crecimiento de miembros.</span>
          <Button variant="secondary" size="sm" onClick={retry}>
            Reintentar
          </Button>
        </GrowthMessage>
      ) : (
        <GrowthBody points={growth.points} showPeriodHint={showPeriodHint} />
      )}
    </ChartCard>
  );
}

function GrowthBody({
  points,
  showPeriodHint,
}: {
  points: ServerGrowthPoint[];
  showPeriodHint: boolean;
}) {
  const [first] = points;
  if (!first) {
    return (
      <GrowthMessage>No hay datos de miembros para este período.</GrowthMessage>
    );
  }
  if (points.length === 1) {
    return (
      <div role="status" className="flex flex-col gap-1">
        <p className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tabular-nums">
            {formatInteger(first.members)}
          </span>
          <span className="text-content-muted text-sm">miembros</span>
        </p>
        {showPeriodHint ? (
          <p className="text-content-muted text-xs">
            Elegí un período más largo para ver la evolución.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div aria-hidden="true" className="h-full">
        <TimeAreaChart
          data={points}
          dataKey="members"
          granularity="day"
          valueLabel="miembros"
          colorVar="--chart-1"
        />
      </div>
      <GrowthTable points={points} />
    </>
  );
}

function singleDaySubtitle(isoDate: string): string {
  if (isoDate === toIsoDate(new Date())) return "Miembros del servidor hoy";
  return `Miembros del servidor al cierre del ${formatDate(parseIsoDate(isoDate).toISOString())}`;
}

function GrowthMessage({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="text-content-muted flex flex-wrap items-center gap-x-3 gap-y-2 text-xs"
    >
      {children}
    </div>
  );
}

function GrowthTable({ points }: { points: ServerGrowthPoint[] }) {
  return (
    <div className="sr-only">
      <table>
        <caption>{SUBTITLE}</caption>
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
