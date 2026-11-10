"use client";

import type { ReactNode } from "react";

import { DossierFullList } from "@/components/dossier/DossierFullList";
import type { ServerDossierSection as Section } from "@/types/servers.types";

import { useServerDossierSection } from "./hooks/useServerDossierSection";
import {
  SERVER_DOSSIER_SECTIONS,
  ServerDossierItems,
  type ServerDossierItemsProps,
} from "./ServerDossierItems";

interface ServerDossierSectionProps {
  serverId: string;
  section: Section;
  header: ReactNode;
}

export function ServerDossierSection({
  serverId,
  section,
  header,
}: ServerDossierSectionProps) {
  const list = useServerDossierSection(serverId, section);
  const { title, empty } = SERVER_DOSSIER_SECTIONS[section];

  return (
    <DossierFullList
      header={header}
      title={title}
      empty={empty}
      list={list}
      renderItems={(items) => (
        <ServerDossierItems
          {...({ section, items } as ServerDossierItemsProps)}
        />
      )}
    />
  );
}
