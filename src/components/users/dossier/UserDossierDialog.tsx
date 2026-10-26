"use client";

import {
  DossierDialog,
  type DossierView,
} from "@/components/dossier/DossierDialog";
import { DossierHeader } from "@/components/dossier/DossierHeader";
import {
  DossierOverviewBody,
  DossierOverviewSkeleton,
} from "@/components/dossier/DossierOverview";
import { useDossierSummary } from "@/components/dossier/hooks/useDossierSummary";
import { Avatar } from "@/components/ui/Avatar";
import { getUserDossierSummary } from "@/services/users/dossierClient";
import type { DossierSection, PlatformUser } from "@/types/users.types";

import { UserDossierActions } from "./UserDossierActions";
import { UserDossierOverview } from "./UserDossierOverview";
import { UserDossierSection } from "./UserDossierSection";

interface UserDossierDialogProps {
  /** Usuario cuyo expediente se muestra; `null` cierra el modal. */
  user: PlatformUser | null;
  onClose: () => void;
  onSuspend: (user: PlatformUser) => void;
  onReactivate: (user: PlatformUser) => void;
}

export function UserDossierDialog({
  user,
  onClose,
  ...actions
}: UserDossierDialogProps) {
  return (
    <DossierDialog<DossierSection>
      contentKey={user?.id ?? null}
      onClose={onClose}
    >
      {(view) =>
        user ? (
          <UserDossierContent user={user} view={view} {...actions} />
        ) : null
      }
    </DossierDialog>
  );
}

const SKELETON_BLOCKS = ["list", "list", "list", "list"] as const;

function UserDossierContent({
  user,
  view,
  onSuspend,
  onReactivate,
}: Omit<UserDossierDialogProps, "user" | "onClose"> & {
  user: PlatformUser;
  view: DossierView<DossierSection>;
}) {
  const { status, summary, retry } = useDossierSummary(
    user,
    getUserDossierSummary,
  );
  const current = summary?.user ?? user;

  const header = (
    <DossierHeader
      name={current.name}
      avatar={<Avatar name={current.name} size={44} />}
      titleId={view.titleId}
      onClose={view.onClose}
    />
  );

  if (view.section) {
    return (
      <UserDossierSection
        user={current}
        section={view.section}
        header={header}
        onBack={view.onBack}
        backRef={view.backRef}
      />
    );
  }

  return (
    <>
      {header}
      <DossierOverviewBody
        status={status}
        onRetry={retry}
        skeleton={<DossierOverviewSkeleton blocks={SKELETON_BLOCKS} />}
        actions={
          <UserDossierActions
            user={current}
            onSuspend={onSuspend}
            onReactivate={onReactivate}
          />
        }
      >
        {summary ? (
          <UserDossierOverview
            summary={summary}
            idPrefix={view.idPrefix}
            onSeeAll={view.onSeeAll}
          />
        ) : null}
      </DossierOverviewBody>
    </>
  );
}
