import { ReferenceDot, ReferenceLine } from "recharts";

import { formatCompact } from "@/utils/chartFormat";
import type { SeriesHighlights } from "@/utils/seriesHighlights";

const labelStyle = { fill: "var(--text-3)", fontSize: 11 };

export function renderChartHighlights(
  highlights: SeriesHighlights | null,
  colorVar: string,
  showPeakDot: boolean,
) {
  if (!highlights) return null;
  const { peak, average } = highlights;

  return [
    <ReferenceLine
      key="average"
      y={average}
      stroke="var(--text-3)"
      strokeDasharray="4 4"
      ifOverflow="extendDomain"
      label={{
        ...labelStyle,
        value: `prom. ${formatCompact(average)}`,
        position: "insideTopRight",
      }}
    />,
    <ReferenceDot
      key="peak"
      x={peak.date}
      y={peak.value}
      r={showPeakDot ? 4 : 0}
      fill={`var(${colorVar})`}
      stroke="var(--bg-card)"
      strokeWidth={2}
      ifOverflow="extendDomain"
      label={{
        ...labelStyle,
        fill: "var(--text-2)",
        fontWeight: 600,
        value: `máx. ${formatCompact(peak.value)}`,
        position: "top",
        offset: 8,
      }}
    />,
  ];
}
