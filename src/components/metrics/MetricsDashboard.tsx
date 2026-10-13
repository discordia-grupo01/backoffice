"use client";

import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { hasActivity } from "@/components/metrics/utils/metricsActivity";
import { usePlatformMetrics } from "@/components/metrics/hooks/usePlatformMetrics";

import { CustomRangeInputs } from "./CustomRangeInputs";
import { ExportCsvButton } from "./ExportCsvButton";
import { MetricCardsGrid } from "./MetricCardsGrid";
import { MetricsCharts } from "./MetricsCharts";
import {
  MetricsEmptyState,
  MetricsErrorState,
  NoStaffAccess,
} from "./MetricsStates";
import { MetricsSkeleton } from "./MetricsSkeleton";
import { PeriodSelector } from "./PeriodSelector";

export function MetricsDashboard() {
  const {
    periodKey,
    setPeriodKey,
    customRange,
    setCustomRange,
    customError,
    status,
    metrics,
    retry,
  } = usePlatformMetrics();

  if (status === "forbidden") return <NoStaffAccess />;

  const showData = status === "success" && metrics !== null && !customError;
  const exportable = showData ? metrics : null;

  return (
    <>
      <PanelHeader
        title="Dashboard y métricas"
        subtitle="Estado y evolución de toda la plataforma"
      >
        <ExportCsvButton metrics={exportable} />
      </PanelHeader>

      <PanelBody>
        <div className="border-line bg-surface-raised mb-5 flex flex-col gap-3 rounded-[14px] border p-3 min-[481px]:px-4 min-[481px]:py-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
          <span className="text-content-muted hidden text-xs font-semibold sm:inline">
            Período:
          </span>
          <PeriodSelector value={periodKey} onChange={setPeriodKey} />
          {periodKey === "custom" ? (
            <CustomRangeInputs
              value={customRange}
              error={customError}
              onChange={setCustomRange}
            />
          ) : null}
        </div>

        {customError ? null : status === "loading" ? (
          <MetricsSkeleton />
        ) : status === "error" ? (
          <MetricsErrorState onRetry={retry} />
        ) : showData && !hasActivity(metrics) ? (
          <MetricsEmptyState />
        ) : showData ? (
          <>
            <MetricCardsGrid totals={metrics.totals} />
            <MetricsCharts metrics={metrics} />
          </>
        ) : null}
      </PanelBody>
    </>
  );
}
