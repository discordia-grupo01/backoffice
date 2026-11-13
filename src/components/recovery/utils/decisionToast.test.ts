import { describe, expect, it } from "vitest";

import type { RecoveryRequestDetail } from "@/types/recovery.types";

import { ALREADY_RESOLVED_MESSAGE, decisionToast } from "./decisionToast";

const failure = (status: number) => ({
  ok: false as const,
  status,
  code: "X",
  message: "x",
});

const request = { id: "r-1" } as RecoveryRequestDetail;

describe("decisionToast", () => {
  it("confirma en verde lo que se decidió", () => {
    expect(decisionToast("approve", { ok: true, request })).toEqual({
      tone: "success",
      message: "Solicitud aprobada",
    });
    expect(decisionToast("reject", { ok: true, request })).toEqual({
      tone: "success",
      message: "Solicitud rechazada",
    });
  });

  it("si otro miembro del staff la resolvió antes, avisa en ámbar", () => {
    expect(decisionToast("approve", failure(409))).toEqual({
      tone: "warning",
      message: ALREADY_RESOLVED_MESSAGE,
    });
  });

  it("explica los errores que dependen de la solicitud", () => {
    expect(decisionToast("approve", failure(404)).message).toBe(
      "Esta solicitud ya no existe.",
    );
    expect(decisionToast("reject", failure(403)).message).toBe(
      "No tenés permisos de staff para resolver solicitudes.",
    );
  });

  it("si falla el servicio dice qué no se pudo hacer", () => {
    expect(decisionToast("approve", failure(502))).toEqual({
      tone: "danger",
      message: "No pudimos aprobar la solicitud. Intentá de nuevo.",
    });
    expect(decisionToast("reject", failure(0)).message).toBe(
      "No pudimos rechazar la solicitud. Intentá de nuevo.",
    );
  });
});
