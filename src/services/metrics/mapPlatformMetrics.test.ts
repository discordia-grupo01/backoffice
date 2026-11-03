import { describe, expect, it } from "vitest";

import { toPlatformMetrics } from "./mapPlatformMetrics";
import type { GlobalMetricsResponse } from "@/types/metrics.types";

const PERIOD = { from: "2026-10-11", to: "2026-10-12" };

function response(
  overrides: Partial<GlobalMetricsResponse>,
): GlobalMetricsResponse {
  return {
    from: new Date(2026, 9, 11).toISOString(),
    to: new Date(2026, 9, 13).toISOString(),
    active_users: 3,
    servers_created: 1,
    messages_sent: 40,
    has_activity: true,
    granularity: "day",
    series: [],
    ...overrides,
  };
}

describe("toPlatformMetrics", () => {
  it("separa los totales y respeta has_activity del back", () => {
    const metrics = toPlatformMetrics(
      PERIOD,
      response({ has_activity: false }),
    );

    expect(metrics.period).toEqual(PERIOD);
    expect(metrics.totals).toEqual({
      active_users: 3,
      servers_created: 1,
      messages_sent: 40,
    });
    expect(metrics.has_activity).toBe(false);
  });

  it("pasa cada día a fecha local", () => {
    const metrics = toPlatformMetrics(
      PERIOD,
      response({
        series: [
          {
            start: new Date(2026, 9, 11).toISOString(),
            active_users: 2,
            servers_created: 1,
            messages_sent: 30,
          },
        ],
      }),
    );

    expect(metrics.series).toEqual([
      {
        date: "2026-10-11",
        active_users: 2,
        servers_created: 1,
        messages_sent: 30,
      },
    ]);
  });

  it("pasa cada hora a hora local", () => {
    const metrics = toPlatformMetrics(
      { from: "2026-10-12", to: "2026-10-12" },
      response({
        granularity: "hour",
        series: [
          {
            start: new Date(2026, 9, 12, 14).toISOString(),
            active_users: 1,
            servers_created: 0,
            messages_sent: 5,
          },
        ],
      }),
    );

    expect(metrics.granularity).toBe("hour");
    expect(metrics.series[0].date).toBe("2026-10-12T14:00");
  });
});
