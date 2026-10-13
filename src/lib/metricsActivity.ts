import type { PlatformMetrics } from "@/types/metrics.types";

export function hasActivity({ totals }: PlatformMetrics): boolean {
  return (
    totals.active_users > 0 ||
    totals.servers_created > 0 ||
    totals.messages_sent > 0
  );
}
