import { Avatar } from "@/components/ui/Avatar";
import {
  DossierCard,
  DossierCardList,
  DossierDatedText,
  ModerationCards,
  ReportCards,
  UNKNOWN_SERVER_NAME,
} from "@/components/dossier/DossierCards";
import type { DossierSection, DossierSectionItems } from "@/types/users.types";

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
              <DossierCard key={membership.server_id}>
                <Avatar name={name} size={28} className="rounded-lg" />
                <p className="min-w-0 flex-1 truncate text-sm">{name}</p>
              </DossierCard>
            );
          })}
        </DossierCardList>
      );
    case "activity":
      return (
        <DossierCardList>
          {items.map((item) => (
            <DossierCard key={item.id}>
              <DossierDatedText
                text={item.description}
                date={item.occurred_at}
              />
            </DossierCard>
          ))}
        </DossierCardList>
      );
    case "reports":
      return <ReportCards items={items} showServer />;
    case "moderation":
      return <ModerationCards items={items} showServer />;
  }
}
