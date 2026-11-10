import { LogIn, LogOut, MessageCircle, type LucideIcon } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import {
  DossierCard,
  DossierCardList,
  DossierEntry,
  ModerationCards,
  ReportCards,
  serverDossierHref,
  UNKNOWN_SERVER_NAME,
  type DossierTone,
} from "@/components/dossier/DossierCards";
import { formatDate } from "@/utils/formatDate";
import type {
  DossierActivityKind,
  DossierSection,
  DossierSectionItems,
} from "@/types/users.types";

const ACTIVITY: Record<
  DossierActivityKind,
  { icon: LucideIcon; tone: DossierTone }
> = {
  message_sent: { icon: MessageCircle, tone: "accent" },
  joined_server: { icon: LogIn, tone: "success" },
  left_server: { icon: LogOut, tone: "muted" },
};

export const USER_DOSSIER_SECTIONS: Record<
  DossierSection,
  { title: string; empty: string }
> = {
  servers: {
    title: "Servidores",
    empty: "No pertenece a ningún servidor.",
  },
  activity: {
    title: "Actividad reciente",
    empty: "No tiene actividad reciente.",
  },
  reports: {
    title: "Reportes recibidos",
    empty: "No recibió reportes.",
  },
  moderation: {
    title: "Acciones de moderación",
    empty: "No tiene acciones de moderación aplicadas.",
  },
};

export const USER_DOSSIER_SECTION_ORDER = Object.keys(
  USER_DOSSIER_SECTIONS,
) as DossierSection[];

export type UserDossierItemsProps = {
  [S in DossierSection]: { section: S; items: DossierSectionItems[S][] };
}[DossierSection];

export function UserDossierItems({ section, items }: UserDossierItemsProps) {
  switch (section) {
    case "servers":
      return (
        <DossierCardList>
          {items.map((membership) => {
            const name = membership.server_name ?? UNKNOWN_SERVER_NAME;
            return (
              <DossierCard
                key={membership.server_id}
                href={
                  membership.server_name
                    ? serverDossierHref(membership.server_id)
                    : undefined
                }
              >
                <Avatar name={name} size={32} className="rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{name}</p>
                  <p className="text-content-muted mt-0.5 text-xs">
                    Miembro desde{" "}
                    <time
                      dateTime={membership.joined_at}
                      className="tabular-nums"
                    >
                      {formatDate(membership.joined_at)}
                    </time>
                  </p>
                </div>
              </DossierCard>
            );
          })}
        </DossierCardList>
      );
    case "activity":
      return (
        <DossierCardList>
          {items.map((item) => {
            const { icon, tone } = ACTIVITY[item.kind] ?? ACTIVITY.message_sent;
            return (
              <DossierEntry
                key={item.id}
                icon={icon}
                tone={tone}
                title={item.description}
                date={item.occurred_at}
                href={serverDossierHref(item.server_id)}
              />
            );
          })}
        </DossierCardList>
      );
    case "reports":
      return <ReportCards items={items} perspective="user" />;
    case "moderation":
      return <ModerationCards items={items} perspective="user" />;
  }
}
