"use client";

import type { ReactNode, Ref } from "react";

import { DossierFullList } from "@/components/dossier/DossierFullList";
import type {
  PlatformServer,
  ServerDossierSection as Section,
} from "@/types/servers.types";

import { useServerDossierSection } from "./hooks/useServerDossierSection";
import {
  SERVER_DOSSIER_SECTIONS,
  ServerDossierItems,
  type ServerDossierItemsProps,
} from "./ServerDossierItems";

interface ServerDossierSectionProps {
  server: PlatformServer;
  section: Section;
  header: ReactNode;
  onBack: () => void;
  backRef: Ref<HTMLButtonElement>;
}

export function ServerDossierSection({
  server,
  section,
  header,
  onBack,
  backRef,
}: ServerDossierSectionProps) {
  const list = useServerDossierSection(server, section);
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
      onBack={onBack}
      backRef={backRef}
    />
  );
}
