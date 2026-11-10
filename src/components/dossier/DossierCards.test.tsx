import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type {
  DossierModerationAction,
  DossierReport,
} from "@/types/dossier.types";

import { ModerationCards, ReportCards } from "./DossierCards";

function action(
  overrides: Partial<DossierModerationAction> = {},
): DossierModerationAction {
  return {
    id: "mod-1",
    kind: "ban",
    applied_at: "2026-11-01T12:00:00Z",
    scope: "server",
    server_id: "srv-1",
    server_name: "Gamers",
    target_user_id: "usr-1",
    target_user_name: "Beto",
    ...overrides,
  };
}

function report(overrides: Partial<DossierReport> = {}): DossierReport {
  return {
    id: "rep-1",
    reason: "Spam",
    created_at: "2026-11-01T12:00:00Z",
    kind: "user",
    status: "pending",
    resolved_at: null,
    server_id: "srv-1",
    server_name: "Gamers",
    reported_user_id: "usr-1",
    reported_user_name: "Beto",
    ...overrides,
  };
}

function linkOf(text: string) {
  return screen.getByText(text).closest("a")?.getAttribute("href") ?? null;
}

describe("ModerationCards desde el expediente de usuario", () => {
  it("dice en qué servidor fue y lleva a su expediente", () => {
    render(<ModerationCards items={[action()]} perspective="user" />);
    expect(linkOf("Baneo en Gamers")).toBe("/servers?expediente=srv-1");
  });

  it("una sanción de plataforma no lleva servidor ni link", () => {
    render(
      <ModerationCards
        items={[action({ kind: "suspension", scope: "platform" })]}
        perspective="user"
      />,
    );
    expect(linkOf("Suspensión")).toBeNull();
  });

  it("sin nombre de servidor dice 'un servidor' y no tiene link", () => {
    render(
      <ModerationCards
        items={[action({ kind: "kick", server_name: null })]}
        perspective="user"
      />,
    );
    expect(linkOf("Expulsión en un servidor")).toBeNull();
  });
});

describe("ModerationCards desde el expediente de servidor", () => {
  it("dice a quién sancionaron y lleva a su expediente", () => {
    render(
      <ModerationCards
        items={[action(), action({ id: "mod-2", kind: "kick" })]}
        perspective="server"
      />,
    );
    expect(linkOf("Baneo a Beto")).toBe("/users?expediente=usr-1");
    expect(screen.getByText("Expulsión de Beto")).toBeInTheDocument();
  });

  it("sin nombre de la persona dice 'un miembro' y no tiene link", () => {
    render(
      <ModerationCards
        items={[action({ kind: "mute", target_user_name: null })]}
        perspective="server"
      />,
    );
    expect(linkOf("Silencio a un miembro")).toBeNull();
  });
});

describe("ReportCards", () => {
  it("desde el usuario: motivo en el servidor, con link al servidor", () => {
    render(<ReportCards items={[report()]} perspective="user" />);
    expect(linkOf("Spam en Gamers")).toBe("/servers?expediente=srv-1");
  });

  it("desde el servidor: contra quién, con link a la persona", () => {
    render(<ReportCards items={[report()]} perspective="server" />);
    expect(linkOf("Spam contra Beto")).toBe("/users?expediente=usr-1");
  });

  it("un reporte de mensaje dice de quién era el mensaje", () => {
    render(
      <ReportCards
        items={[report({ kind: "message", reported_user_name: null })]}
        perspective="server"
      />,
    );
    expect(linkOf("Spam en un mensaje de un miembro")).toBeNull();
  });
});
