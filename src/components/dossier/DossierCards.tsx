import {
  Ban,
  Flag,
  Gavel,
  Mic,
  MicOff,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
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

export const UNKNOWN_SERVER_NAME = "Servidor desconocido";

export type DossierTone = "accent" | "success" | "warning" | "danger" | "muted";

const TONES: Record<DossierTone, string> = {
  accent: "bg-bo/15 text-bo",
  success: "bg-success/15 text-success-readable",
  warning: "bg-warning/15 text-warning-readable",
  danger: "bg-danger/15 text-danger-readable",
  muted: "bg-content-subtle/15 text-content-muted",
};

interface DossierEntryProps {
  icon: LucideIcon;
  tone: DossierTone;
  title: string;
  date: string;
}

export function DossierEntry({
  icon: Icon,
  tone,
  title,
  date,
}: DossierEntryProps) {
  return (
    <DossierCard>
      <span
        aria-hidden
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          TONES[tone],
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm">{title}</p>
        <time
          dateTime={date}
          className="text-content-muted mt-0.5 block text-xs tabular-nums"
        >
          {formatDateTime(date)}
        </time>
      </div>
    </DossierCard>
  );
}

/** Mismo formato que arma el back en la actividad: "Se unió a Gamers", "Envió un mensaje en #general de Gamers". */
function inServer(text: string, serverName: string | null): string {
  return `${text} en ${serverName ?? "un servidor"}`;
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
        <DossierEntry
          key={report.id}
          icon={Flag}
          tone="warning"
          title={
            showServer
              ? inServer(report.reason, report.server_name)
              : report.reason
          }
          date={report.created_at}
        />
      ))}
    </DossierCardList>
  );
}

const MODERATION: Record<
  DossierModerationKind,
  { label: string; icon: LucideIcon; tone: DossierTone }
> = {
  suspension: { label: "Suspensión", icon: Ban, tone: "danger" },
  reactivation: { label: "Reactivación", icon: UserCheck, tone: "success" },
  deletion_requested: {
    label: "Pedido de eliminación",
    icon: Trash2,
    tone: "danger",
  },
  ban: { label: "Baneo", icon: Gavel, tone: "danger" },
  unban: { label: "Revocación de baneo", icon: ShieldCheck, tone: "success" },
  kick: { label: "Expulsión", icon: UserX, tone: "danger" },
  mute: { label: "Silencio", icon: MicOff, tone: "warning" },
  unmute: { label: "Fin del silencio", icon: Mic, tone: "success" },
};

const UNKNOWN_MODERATION = { icon: Ban, tone: "muted" } as const;

export function ModerationCards({
  items,
  showServer = false,
}: DossierItemsProps<DossierModerationAction>) {
  return (
    <DossierCardList>
      {items.map((action) => {
        const { label, icon, tone } = MODERATION[action.kind] ?? {
          ...UNKNOWN_MODERATION,
          label: action.kind,
        };
        return (
          <DossierEntry
            key={action.id}
            icon={icon}
            tone={tone}
            title={
              showServer && action.scope === "server"
                ? inServer(label, action.server_name)
                : label
            }
            date={action.applied_at}
          />
        );
      })}
    </DossierCardList>
  );
}
