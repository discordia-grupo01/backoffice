import { describe, expect, it } from "vitest";

import { deleteServerErrorMessage } from "./deleteServerError";

describe("deleteServerErrorMessage", () => {
  it("explica la falta de permisos de staff", () => {
    expect(deleteServerErrorMessage("FORBIDDEN")).toBe(
      "No tenés permisos de staff para eliminar servidores.",
    );
  });

  it("avisa cuando el nombre no coincide", () => {
    expect(deleteServerErrorMessage("DELETE_CONFIRMATION_MISMATCH")).toBe(
      "El nombre no coincide con el del servidor.",
    );
  });

  it("usa un texto genérico para el resto", () => {
    expect(deleteServerErrorMessage("UNAVAILABLE")).toBe(
      "No pudimos eliminar el servidor. Intentá de nuevo.",
    );
  });
});
