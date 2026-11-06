import { describe, expect, it } from "vitest";

import { serverSuspensionErrorMessage } from "./serverSuspensionError";

describe("serverSuspensionErrorMessage", () => {
  it("explica la falta de permisos según la acción", () => {
    expect(serverSuspensionErrorMessage("suspend", "FORBIDDEN")).toBe(
      "No tenés permisos de staff para suspender servidores.",
    );
    expect(serverSuspensionErrorMessage("reactivate", "FORBIDDEN")).toBe(
      "No tenés permisos de staff para reactivar servidores.",
    );
  });

  it("avisa si el servidor ya no existe", () => {
    expect(serverSuspensionErrorMessage("suspend", "SERVER_NOT_FOUND")).toBe(
      "Este servidor ya no existe.",
    );
  });

  it("cualquier otro error pide reintentar", () => {
    expect(serverSuspensionErrorMessage("reactivate", "UNAVAILABLE")).toBe(
      "No pudimos reactivar el servidor. Intentá de nuevo.",
    );
  });
});
