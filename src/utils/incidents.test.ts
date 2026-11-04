import { describe, expect, it } from "vitest";

import {
  INCIDENT_TITLE_MAX,
  serviceLabel,
  toIncidentInput,
  validateIncidentDraft,
  type IncidentDraft,
} from "./incidents";

const validDraft: IncidentDraft = {
  title: "Demoras en mensajes",
  description: "Los mensajes llegan con demora.",
  services: ["messaging"],
  type: "degraded",
};

describe("validateIncidentDraft", () => {
  it("acepta un borrador completo", () => {
    expect(validateIncidentDraft(validDraft)).toEqual({});
  });

  it("exige título, descripción y al menos un servicio", () => {
    const errors = validateIncidentDraft({
      ...validDraft,
      title: "   ",
      description: "",
      services: [],
    });
    expect(errors.title).toBeDefined();
    expect(errors.description).toBeDefined();
    expect(errors.services).toBeDefined();
  });

  it("rechaza un título más largo que el límite del back", () => {
    const errors = validateIncidentDraft({
      ...validDraft,
      title: "a".repeat(INCIDENT_TITLE_MAX + 1),
    });
    expect(errors.title).toBeDefined();
  });
});

describe("toIncidentInput", () => {
  const body = {
    title: "  Demoras  ",
    description: " Detalle ",
    affected_services: ["messaging", "messaging", "voice"],
    platform_status: "maintenance",
  };

  it("recorta los textos y saca servicios repetidos", () => {
    expect(toIncidentInput(body)).toEqual({
      title: "Demoras",
      description: "Detalle",
      affected_services: ["messaging", "voice"],
      platform_status: "maintenance",
    });
  });

  it("rechaza servicios que no tienen health check", () => {
    expect(
      toIncidentInput({ ...body, affected_services: ["inventado"] }),
    ).toBeNull();
  });

  it("rechaza un tipo inválido o un body que no es objeto", () => {
    expect(
      toIncidentInput({ ...body, platform_status: "operational" }),
    ).toBeNull();
    expect(toIncidentInput(null)).toBeNull();
  });
});

describe("serviceLabel", () => {
  it("devuelve el nombre legible o el id si no lo conoce", () => {
    expect(serviceLabel("messaging")).toBe("Mensajería");
    expect(serviceLabel("otro")).toBe("otro");
  });
});
