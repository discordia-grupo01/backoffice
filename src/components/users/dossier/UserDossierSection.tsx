"use client";

import type { ReactNode } from "react";

import { DossierFullList } from "@/components/dossier/DossierFullList";
import type { DossierSection } from "@/types/users.types";

import { useDossierSection } from "./hooks/useDossierSection";
import {
  USER_DOSSIER_SECTIONS,
  UserDossierItems,
  type UserDossierItemsProps,
} from "./UserDossierItems";

interface UserDossierSectionProps {
  userId: string;
  section: DossierSection;
  header: ReactNode;
}

export function UserDossierSection({
  userId,
  section,
  header,
}: UserDossierSectionProps) {
  const list = useDossierSection(userId, section);
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
    />
  );
}
