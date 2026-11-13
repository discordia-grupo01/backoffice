import { describe, expect, it } from "vitest";

import { formatDateTime } from "@/utils/formatDate";

import {
  previousRequestsText,
  requesterName,
  resolutionText,
  UNKNOWN_USER_NAME,
} from "./recoveryText";

const RESOLVED_AT = "2026-11-13T14:05:00Z";

describe("resolutionText", () => {
  it("no dice nada mientras está pendiente", () => {
    expect(
      resolutionText({
        status: "pending",
        resolved_at: null,
        resolved_by: null,
      }),
    ).toBeNull();
  });

  it("dice quién la aprobó y cuándo", () => {
    expect(
      resolutionText({
        status: "approved",
        resolved_at: RESOLVED_AT,
        resolved_by: { id: "s-1", name: "Beto" },
      }),
    ).toBe(`Aprobada por Beto el ${formatDateTime(RESOLVED_AT)}`);
  });

  it("sin el nombre del staff no deja un hueco", () => {
    expect(
      resolutionText({
        status: "rejected",
        resolved_at: RESOLVED_AT,
        resolved_by: { id: "s-1", name: null },
      }),
    ).toBe(
      `Rechazada por un miembro del staff el ${formatDateTime(RESOLVED_AT)}`,
    );
  });
});

describe("previousRequestsText", () => {
  it.each([
    [{ total: 0, rejected: 0 }, "Ninguna"],
    [{ total: 1, rejected: 0 }, "1"],
    [{ total: 2, rejected: 1 }, "2 (1 rechazada)"],
    [{ total: 3, rejected: 2 }, "3 (2 rechazadas)"],
  ])("%o se lee %s", (previous, expected) => {
    expect(previousRequestsText(previous)).toBe(expected);
  });
});

describe("requesterName", () => {
  it("usa un nombre genérico si el usuario todavía no está en la réplica", () => {
    expect(requesterName({ user: null })).toBe(UNKNOWN_USER_NAME);
  });
});
