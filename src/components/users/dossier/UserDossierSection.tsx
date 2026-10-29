"use client";

import type { ReactNode, Ref } from "react";

import { DossierFullList } from "@/components/dossier/DossierFullList";
import type { DossierSection, PlatformUser } from "@/types/users.types";

import { useDossierSection } from "./hooks/useDossierSection";
import {
  USER_DOSSIER_SECTIONS,
  UserDossierItems,
  type UserDossierItemsProps,
} from "./UserDossierItems";

interface UserDossierSectionProps {
  user: PlatformUser;
  section: DossierSection;
  header: ReactNode;
  onBack: () => void;
  backRef: Ref<HTMLButtonElement>;
}

/** "Ver todos" de una sección del expediente de usuario. */
export function UserDossierSection({
  user,
  section,
  header,
  onBack,
  backRef,
}: UserDossierSectionProps) {
  const list = useDossierSection(user, section);
  const { title, empty } = USER_DOSSIER_SECTIONS[section];

  return (
    <DossierFullList
      header={header}
      title={title}
      empty={empty}
      list={list}
      renderItems={(items) => (
        <UserDossierItems {...({ section, items } as UserDossierItemsProps)} />
      )}
      onBack={onBack}
      backRef={backRef}
    />
  );
}
