import { describe, expect, it } from "vitest";

import type { Incident, ServiceHealthCheck } from "@/types/status.types";

import {
  checkedAgoLabel,
  findUnreportedFailures,
  servicesDownLabel,
  unreportedFailuresHeadline,
  unreportedFailuresHint,
} from "./serviceHealth";

const check = (
  service: ServiceHealthCheck["service"],
  health: ServiceHealthCheck["health"],
): ServiceHealthCheck => ({ service, health, checked_at: "" });

const incident = (services: string[]): Incident => ({
  id: "1",
  title: "t",
  description: "d",
  affected_services: services,
  platform_status: "degraded",
  status: "active",
  created_at: "",
});

describe("findUnreportedFailures", () => {
  const checks = [
    check("identify", "healthy"),
    check("voice", "unavailable"),
    check("metrics", "no_data"),
  ];

  it("devuelve los servicios caídos sin incidente", () => {
    expect(findUnreportedFailures(checks, [])).toEqual(["voice"]);
  });

  it("excluye los que ya tienen un incidente activo", () => {
    expect(findUnreportedFailures(checks, [incident(["voice"])])).toEqual([]);
  });
});

describe("unreportedFailuresHeadline", () => {
  it("conjuga según la cantidad", () => {
    expect(unreportedFailuresHeadline(["Voz"])).toBe("Voz no está disponible");
    expect(unreportedFailuresHeadline(["Voz", "Mensajería"])).toBe(
      "Voz y Mensajería no están disponibles",
    );
  });
});

describe("unreportedFailuresHint", () => {
  it("explica qué ven los usuarios según los incidentes publicados", () => {
    expect(unreportedFailuresHint(0)).toBe(
      "Los usuarios todavía no ven ningún aviso. Publicá un incidente para avisarles.",
    );
    expect(unreportedFailuresHint(1)).toBe(
      "Los usuarios ven el aviso publicado, pero no saben de esta falla. Publicá un incidente para avisarles.",
    );
    expect(unreportedFailuresHint(2)).toContain("los avisos publicados");
  });
});

describe("servicesDownLabel", () => {
  it("usa singular y plural", () => {
    expect(servicesDownLabel(1)).toBe("1 servicio no disponible");
    expect(servicesDownLabel(3)).toBe("3 servicios no disponibles");
  });
});

describe("checkedAgoLabel", () => {
  const now = Date.parse("2026-11-04T12:00:00Z");

  it("usa segundos, minutos u horas", () => {
    expect(checkedAgoLabel("2026-11-04T11:59:52Z", now)).toBe("hace 8 s");
    expect(checkedAgoLabel("2026-11-04T11:57:00Z", now)).toBe("hace 3 min");
    expect(checkedAgoLabel("2026-11-04T10:00:00Z", now)).toBe("hace 2 h");
  });
});
