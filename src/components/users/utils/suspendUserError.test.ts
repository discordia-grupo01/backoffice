import { describe, expect, it } from "vitest";

import {
  SUSPEND_USER_ERROR,
  suspendUserErrorMessage,
} from "./suspendUserError";

describe("suspendUserErrorMessage", () => {
  it("distingue los dos 403 por su code", () => {
    expect(suspendUserErrorMessage("CANNOT_SUSPEND_STAFF")).toBe(
      "No se puede suspender a un miembro del staff.",
    );
    expect(suspendUserErrorMessage("FORBIDDEN")).toBe(
      "No tenés permisos de staff para suspender usuarios.",
    );
  });

  it("explica que el usuario ya no existe", () => {
    expect(suspendUserErrorMessage("USER_NOT_FOUND")).toBe(
      "Este usuario ya no existe.",
    );
  });

  it("usa el texto genérico para errores de red o desconocidos", () => {
    expect(suspendUserErrorMessage("NETWORK_ERROR")).toBe(SUSPEND_USER_ERROR);
    expect(suspendUserErrorMessage("UNAVAILABLE")).toBe(SUSPEND_USER_ERROR);
  });
});
