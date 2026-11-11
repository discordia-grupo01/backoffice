import type { ServerGrowthPoint } from "@/types/metrics.types";

export interface MemberGrowthSummary {
  members: number;
  change: number | null;
  since: string;
}

export function summarizeGrowth(
  points: ServerGrowthPoint[],
): MemberGrowthSummary | null {
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) return null;
  return {
    members: last.members,
    change: points.length > 1 ? last.members - first.members : null,
    since: first.date,
  };
}
