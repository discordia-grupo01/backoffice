import { describe, expect, it } from "vitest";

import { suspensionErrorMessage } from "./suspensionError";

describe("suspensionErrorMessage", () => {
  it("distingue los dos 403 al suspender", () => {
    expect(suspensionErrorMessage("suspend", "CANNOT_SUSPEND_STAFF")).toBe(
      "No se puede suspender a un miembro del staff.",
    );
    expect(suspensionErrorMessage("suspend", "FORBIDDEN")).toBe(
      "No tenés permisos de staff para suspender usuarios.",
    );
  });

  it("nombra la acción en el error de permisos", () => {
    expect(suspensionErrorMessage("reactivate", "FORBIDDEN")).toBe(
      "No tenés permisos de staff para reactivar usuarios.",
    );
  });

  it("explica que el usuario ya no existe", () => {
    expect(suspensionErrorMessage("reactivate", "USER_NOT_FOUND")).toBe(
      "Este usuario ya no existe.",
    );
  });

  it("usa el texto genérico de cada acción para errores de red o desconocidos", () => {
    expect(suspensionErrorMessage("suspend", "NETWORK_ERROR")).toBe(
      "No pudimos suspender al usuario. Intentá de nuevo.",
    );
    expect(suspensionErrorMessage("reactivate", "UNAVAILABLE")).toBe(
      "No pudimos reactivar al usuario. Intentá de nuevo.",
    );
  });
});
