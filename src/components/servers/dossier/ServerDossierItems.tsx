import {
  ModerationCards,
  ReportCards,
} from "@/components/dossier/DossierCards";
import type {
  ServerDossierSection,
  ServerDossierSectionItems,
} from "@/types/servers.types";

export const SERVER_DOSSIER_SECTIONS: Record<
  ServerDossierSection,
  { title: string; empty: string }
> = {
  reports: {
    title: "Reportes recibidos",
    empty: "No hay reportes sobre este servidor ni sus miembros.",
  },
  moderation: {
    title: "Acciones de moderación",
    empty: "No tiene acciones de moderación aplicadas.",
  },
};

export const SERVER_DOSSIER_SECTION_ORDER = Object.keys(
  SERVER_DOSSIER_SECTIONS,
) as ServerDossierSection[];

export type ServerDossierItemsProps = {
  [S in ServerDossierSection]: {
    section: S;
    items: ServerDossierSectionItems[S][];
  };
}[ServerDossierSection];

export function ServerDossierItems({
  section,
  items,
}: ServerDossierItemsProps) {
  switch (section) {
    case "reports":
      return <ReportCards items={items} />;
    case "moderation":
      return <ModerationCards items={items} />;
  }
}
