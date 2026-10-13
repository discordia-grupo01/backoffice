import { describe, expect, it } from "vitest";

import { hasActivity } from "@/lib/metricsActivity";

import { buildMockPlatformMetrics } from "./mockPlatformMetrics";

const NOW = new Date(2026, 9, 12, 14, 5);

describe("buildMockPlatformMetrics", () => {
  it("devuelve un punto por día del período", () => {
    const metrics = buildMockPlatformMetrics(
      { from: "2026-10-06", to: "2026-10-12" },
      NOW,
    );

    expect(metrics.granularity).toBe("day");
    expect(metrics.series).toHaveLength(7);
    expect(metrics.series[0].date).toBe("2026-10-06");
  });

  it("es determinista para el mismo período", () => {
    const period = { from: "2026-10-06", to: "2026-10-12" };

    expect(buildMockPlatformMetrics(period, NOW)).toEqual(
      buildMockPlatformMetrics(period, NOW),
    );
  });

  it("hoy es horario y llega hasta la hora actual", () => {
    const metrics = buildMockPlatformMetrics(
      { from: "2026-10-12", to: "2026-10-12" },
      NOW,
    );

    expect(metrics.granularity).toBe("hour");
    expect(metrics.series).toHaveLength(15);
    expect(metrics.series[14].date).toBe("2026-10-12T14:00");
  });

  it("los servidores y mensajes totales son la suma de la serie", () => {
    const metrics = buildMockPlatformMetrics(
      { from: "2026-10-06", to: "2026-10-12" },
      NOW,
    );
    const sum = (key: "servers_created" | "messages_sent") =>
      metrics.series.reduce((total, point) => total + point[key], 0);

    expect(metrics.totals.servers_created).toBe(sum("servers_created"));
    expect(metrics.totals.messages_sent).toBe(sum("messages_sent"));
  });

  it("un período anterior al lanzamiento no tiene actividad", () => {
    const metrics = buildMockPlatformMetrics(
      { from: "2025-01-01", to: "2025-01-31" },
      NOW,
    );

    expect(hasActivity(metrics)).toBe(false);
  });
});
