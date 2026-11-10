"use client";

import { useMemo, useState } from "react";

import {
  addDays,
  presetPeriod,
  toIsoDate,
  validateCustomRange,
  type CustomRangeError,
} from "@/utils/metricsPeriod";
import type { MetricsPeriod, MetricsPeriodKey } from "@/types/metrics.types";

function defaultCustomRange(): MetricsPeriod {
  const now = new Date();
  return { from: toIsoDate(addDays(now, -6)), to: toIsoDate(now) };
}

export function useMetricsPeriod(initialKey: MetricsPeriodKey = "7d") {
  const [periodKey, setPeriodKey] = useState<MetricsPeriodKey>(initialKey);
  const [customRange, setCustomRange] =
    useState<MetricsPeriod>(defaultCustomRange);

  const customError: CustomRangeError | null =
    periodKey === "custom" ? validateCustomRange(customRange) : null;

  const period = useMemo<MetricsPeriod | null>(() => {
    if (periodKey !== "custom") return presetPeriod(periodKey);
    return validateCustomRange(customRange) ? null : customRange;
  }, [periodKey, customRange]);

  return {
    periodKey,
    setPeriodKey,
    customRange,
    setCustomRange,
    customError,
    period,
  };
}

export type MetricsPeriodState = ReturnType<typeof useMetricsPeriod>;
