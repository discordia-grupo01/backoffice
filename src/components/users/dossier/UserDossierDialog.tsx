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
import type { DossierUrl } from "@/components/dossier/hooks/useDossierUrl";
import { Avatar } from "@/components/ui/Avatar";
import { getUserDossierSummary } from "@/services/users/dossierClient";
import type { DossierSection, PlatformUser } from "@/types/users.types";

import { UserDossierActions } from "./UserDossierActions";
import { UserDossierOverview } from "./UserDossierOverview";
import { UserDossierSection } from "./UserDossierSection";

interface UserDossierActionHandlers {
  onSuspend: (user: PlatformUser) => void;
  onReactivate: (user: PlatformUser) => void;
}

interface UserDossierDialogProps extends UserDossierActionHandlers {
  nav: DossierUrl<DossierSection>;
  placeholder: PlatformUser | null;
  refreshKey: number;
}

export function UserDossierDialog({ nav, ...props }: UserDossierDialogProps) {
  return (
    <DossierDialog<DossierSection> nav={nav}>
      {(view) => <UserDossierContent view={view} {...props} />}
    </DossierDialog>
  );
}

const SKELETON_BLOCKS = ["list", "list", "list", "list"] as const;

function UserDossierContent({
  view,
  placeholder,
  refreshKey,
  onSuspend,
  onReactivate,
}: Omit<UserDossierDialogProps, "nav"> & {
  view: DossierView<DossierSection> & { subjectId: string };
}) {
  const { status, summary, retry } = useDossierSummary(
    view.subjectId,
    getUserDossierSummary,
    refreshKey,
  );
  const user =
    summary?.user ?? (placeholder?.id === view.subjectId ? placeholder : null);
  const name = user?.name ?? "";

  const header = (
    <DossierHeader
      name={name}
      avatar={<Avatar name={name} size={44} />}
      titleId={view.titleId}
      onClose={view.onClose}
      onBack={view.section ? view.onBack : undefined}
      backRef={view.backRef}
    />
  );

  if (view.section) {
    return (
      <UserDossierSection
        userId={view.subjectId}
        section={view.section}
        header={header}
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
          user ? (
            <UserDossierActions
              user={user}
              onSuspend={onSuspend}
              onReactivate={onReactivate}
            />
          ) : null
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
