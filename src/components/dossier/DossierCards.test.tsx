import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type {
  DossierModerationAction,
  DossierReport,
} from "@/types/dossier.types";

import { ModerationCards, ReportCards } from "./DossierCards";

function action(
  overrides: Partial<DossierModerationAction>,
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

const report: DossierReport = {
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
};

describe("ModerationCards", () => {
  it("dice en qué servidor se aplicó una sanción de servidor", () => {
    render(<ModerationCards items={[action({})]} showServer />);
    expect(screen.getByText("Baneo en Gamers")).toBeInTheDocument();
  });

  it("no agrega servidor a una sanción de plataforma", () => {
    render(
      <ModerationCards
        items={[action({ kind: "suspension", scope: "platform" })]}
        showServer
      />,
    );
    expect(screen.getByText("Suspensión")).toBeInTheDocument();
  });

  it("usa 'un servidor' si todavía no se conoce el nombre", () => {
    render(
      <ModerationCards
        items={[action({ kind: "kick", server_name: null })]}
        showServer
      />,
    );
    expect(screen.getByText("Expulsión en un servidor")).toBeInTheDocument();
  });

  it("sin showServer muestra solo la etiqueta", () => {
    render(<ModerationCards items={[action({ kind: "mute" })]} />);
    expect(screen.getByText("Silencio")).toBeInTheDocument();
  });
});

describe("ReportCards", () => {
  it("agrega el servidor al motivo cuando se pide", () => {
    render(<ReportCards items={[report]} showServer />);
    expect(screen.getByText("Spam en Gamers")).toBeInTheDocument();
  });

  it("sin showServer muestra solo el motivo", () => {
    render(<ReportCards items={[report]} />);
    expect(screen.getByText("Spam")).toBeInTheDocument();
  });
});
