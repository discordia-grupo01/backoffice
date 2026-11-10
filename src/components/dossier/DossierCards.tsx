import {
  Ban,
  ChevronRight,
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
import Link from "next/link";
import type { ReactNode } from "react";

import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/utils/formatDate";
import type {
  DossierModerationAction,
  DossierModerationKind,
  DossierReport,
} from "@/types/dossier.types";

import { dossierHref } from "./hooks/useDossierUrl";

export function DossierCardList({ children }: { children: ReactNode }) {
  return <ul className="space-y-2">{children}</ul>;
}

const CARD =
  "border-line bg-surface-input flex items-center gap-3 rounded-xl border px-4 py-3";

export function DossierCard({
  children,
  href,
}: {
  children: ReactNode;
  href?: string;
}) {
  if (!href) return <li className={CARD}>{children}</li>;
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        className={cn(
          CARD,
          "hover:border-line-strong hover:bg-surface-hover focus-visible:ring-bo transition-colors focus-visible:ring-2 focus-visible:outline-none",
        )}
      >
        {children}
        <ChevronRight
          aria-hidden
          className="text-content-subtle size-4 shrink-0"
        />
      </Link>
    </li>
  );
}

export const UNKNOWN_SERVER_NAME = "Servidor desconocido";

export function serverDossierHref(serverId: string): string {
  return dossierHref(ROUTES.servers, serverId);
}

export function userDossierHref(userId: string): string {
  return dossierHref(ROUTES.users, userId);
}

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
  href?: string;
}

export function DossierEntry({
  icon: Icon,
  tone,
  title,
  date,
  href,
}: DossierEntryProps) {
  return (
    <DossierCard href={href}>
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

export type DossierPerspective = "user" | "server";

const UNKNOWN_MEMBER = "un miembro";

/** Mismo formato que arma el back en la actividad: "Se unió a Gamers". */
function inServer(text: string, serverName: string | null): string {
  return `${text} en ${serverName ?? "un servidor"}`;
}

function serverLink(serverId: string | null, serverName: string | null) {
  return serverId && serverName ? serverDossierHref(serverId) : undefined;
}

function userLink(userId: string | null, userName: string | null) {
  return userId && userName ? userDossierHref(userId) : undefined;
}

interface DossierItemsProps<T> {
  items: T[];
  perspective: DossierPerspective;
}

function reportView(report: DossierReport, perspective: DossierPerspective) {
  if (perspective === "user") {
    return {
      title: inServer(report.reason, report.server_name),
      href: serverLink(report.server_id, report.server_name),
    };
  }
  const who = report.reported_user_name ?? UNKNOWN_MEMBER;
  return {
    title:
      report.kind === "message"
        ? `${report.reason} en un mensaje de ${who}`
        : `${report.reason} contra ${who}`,
    href: userLink(report.reported_user_id, report.reported_user_name),
  };
}

export function ReportCards({
  items,
  perspective,
}: DossierItemsProps<DossierReport>) {
  return (
    <DossierCardList>
      {items.map((report) => (
        <DossierEntry
          key={report.id}
          icon={Flag}
          tone="warning"
          date={report.created_at}
          {...reportView(report, perspective)}
        />
      ))}
    </DossierCardList>
  );
}

/** `toWhom` arma la frase con la persona sancionada: "Baneo a Beto", "Expulsión de Beto". */
const MODERATION: Record<
  DossierModerationKind,
  { label: string; icon: LucideIcon; tone: DossierTone; toWhom?: "a" | "de" }
> = {
  suspension: { label: "Suspensión", icon: Ban, tone: "danger" },
  reactivation: { label: "Reactivación", icon: UserCheck, tone: "success" },
  deletion_requested: {
    label: "Pedido de eliminación",
    icon: Trash2,
    tone: "danger",
  },
  ban: { label: "Baneo", icon: Gavel, tone: "danger", toWhom: "a" },
  unban: {
    label: "Revocación de baneo",
    icon: ShieldCheck,
    tone: "success",
    toWhom: "a",
  },
  kick: { label: "Expulsión", icon: UserX, tone: "danger", toWhom: "de" },
  mute: { label: "Silencio", icon: MicOff, tone: "warning", toWhom: "a" },
  unmute: {
    label: "Fin del silencio",
    icon: Mic,
    tone: "success",
    toWhom: "de",
  },
};

const UNKNOWN_MODERATION = { icon: Ban, tone: "muted" } as const;

function moderationView(
  action: DossierModerationAction,
  perspective: DossierPerspective,
) {
  const { label, icon, tone, toWhom } = MODERATION[action.kind] ?? {
    ...UNKNOWN_MODERATION,
    label: action.kind,
  };
  if (action.scope !== "server") return { label, icon, tone };
  if (perspective === "user") {
    return {
      label: inServer(label, action.server_name),
      icon,
      tone,
      href: serverLink(action.server_id, action.server_name),
    };
  }
  return {
    label: `${label} ${toWhom ?? "a"} ${action.target_user_name ?? UNKNOWN_MEMBER}`,
    icon,
    tone,
    href: userLink(action.target_user_id, action.target_user_name),
  };
}

export function ModerationCards({
  items,
  perspective,
}: DossierItemsProps<DossierModerationAction>) {
  return (
    <DossierCardList>
      {items.map((action) => {
        const { label, ...view } = moderationView(action, perspective);
        return (
          <DossierEntry
            key={action.id}
            title={label}
            date={action.applied_at}
            {...view}
          />
        );
      })}
    </DossierCardList>
  );
}
