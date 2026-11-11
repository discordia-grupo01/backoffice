"use client";

import { NoStaffAccess } from "@/components/layout/NoStaffAccess";
import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { usePlatformMetrics } from "@/components/metrics/hooks/usePlatformMetrics";

import { MetricCardsGrid } from "./MetricCardsGrid";
import { MetricsCharts } from "./MetricsCharts";
import { MetricsPeriodBar } from "./MetricsPeriodBar";
import { MetricsEmptyState, MetricsErrorState } from "./MetricsStates";
import { MetricsSkeleton } from "./MetricsSkeleton";

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

  return (
    <>
      <PanelHeader
        title="Dashboard y métricas"
        subtitle="Estado y evolución de toda la plataforma"
      />

      <PanelBody>
        <MetricsPeriodBar
          className="mb-5"
          periodKey={periodKey}
          onPeriodChange={setPeriodKey}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          customError={customError}
        />

        {customError ? null : status === "loading" ? (
          <MetricsSkeleton />
        ) : status === "error" ? (
          <MetricsErrorState onRetry={retry} />
        ) : showData && !metrics.has_activity ? (
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
