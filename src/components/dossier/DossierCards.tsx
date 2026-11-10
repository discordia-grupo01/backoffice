import type { ReactNode } from "react";

import { formatDateTime } from "@/utils/formatDate";
import type {
  DossierModerationAction,
  DossierModerationKind,
  DossierReport,
} from "@/types/dossier.types";

export function DossierCardList({ children }: { children: ReactNode }) {
  return <ul className="space-y-2">{children}</ul>;
}

export function DossierCard({ children }: { children: ReactNode }) {
  return (
    <li className="border-line bg-surface-input flex items-center gap-3 rounded-xl border px-4 py-3">
      {children}
    </li>
  );
}

export function DossierDatedText({
  text,
  date,
}: {
  text: string;
  date: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-sm">{text}</p>
      <time
        dateTime={date}
        className="text-content-muted mt-0.5 block text-xs tabular-nums"
      >
        {formatDateTime(date)}
      </time>
    </div>
  );
}

export const UNKNOWN_SERVER_NAME = "Servidor desconocido";

function inServer(name: string | null): string {
  return `en ${name ?? "un servidor"}`;
}

interface DossierItemsProps<T> {
  items: T[];
  showServer?: boolean;
}

export function ReportCards({
  items,
  showServer = false,
}: DossierItemsProps<DossierReport>) {
  return (
    <DossierCardList>
      {items.map((report) => (
        <DossierCard key={report.id}>
          <DossierDatedText
            text={
              showServer
                ? `${report.reason} · ${inServer(report.server_name)}`
                : report.reason
            }
            date={report.created_at}
          />
        </DossierCard>
      ))}
    </DossierCardList>
  );
}

const MODERATION_LABEL: Record<DossierModerationKind, string> = {
  suspension: "Suspensión",
  reactivation: "Reactivación",
  deletion_requested: "Pedido de eliminación",
  ban: "Baneo",
  unban: "Revocación de baneo",
  kick: "Expulsión",
  mute: "Silencio",
  unmute: "Fin del silencio",
};

function moderationText(
  action: DossierModerationAction,
  showServer: boolean,
): string {
  const label = MODERATION_LABEL[action.kind] ?? action.kind;
  return showServer && action.scope === "server"
    ? `${label} ${inServer(action.server_name)}`
    : label;
}

export function ModerationCards({
  items,
  showServer = false,
}: DossierItemsProps<DossierModerationAction>) {
  return (
    <DossierCardList>
      {items.map((action) => (
        <DossierCard key={action.id}>
          <DossierDatedText
            text={moderationText(action, showServer)}
            date={action.applied_at}
          />
        </DossierCard>
      ))}
    </DossierCardList>
  );
}
