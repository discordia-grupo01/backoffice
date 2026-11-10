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
import { getServerDossierSummary } from "@/services/servers/dossierClient";
import type {
  PlatformServer,
  ServerDossierSection,
} from "@/types/servers.types";

import {
  ServerDossierActions,
  type ServerDossierActionHandlers,
} from "./ServerDossierActions";
import { ServerDossierOverview } from "./ServerDossierOverview";
import { ServerDossierSection as SectionScreen } from "./ServerDossierSection";

interface ServerDossierDialogProps extends ServerDossierActionHandlers {
  nav: DossierUrl<ServerDossierSection>;
  placeholder: PlatformServer | null;
  refreshKey: number;
}

export function ServerDossierDialog({
  nav,
  ...props
}: ServerDossierDialogProps) {
  return (
    <DossierDialog<ServerDossierSection> nav={nav}>
      {(view) => <ServerDossierContent view={view} {...props} />}
    </DossierDialog>
  );
}

const SKELETON_BLOCKS = ["chart", "list", "list"] as const;

function ServerDossierContent({
  view,
  placeholder,
  refreshKey,
  ...actions
}: Omit<ServerDossierDialogProps, "nav"> & {
  view: DossierView<ServerDossierSection> & { subjectId: string };
}) {
  const { status, summary, retry } = useDossierSummary(
    view.subjectId,
    getServerDossierSummary,
    refreshKey,
  );
  const server =
    summary?.server ??
    (placeholder?.id === view.subjectId ? placeholder : null);
  const name = server?.name ?? "";

  const header = (
    <DossierHeader
      name={name}
      avatar={<Avatar name={name} size={44} className="rounded-xl" />}
      titleId={view.titleId}
      onClose={view.onClose}
    />
  );

  if (view.section) {
    return (
      <SectionScreen
        serverId={view.subjectId}
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
          server ? <ServerDossierActions server={server} {...actions} /> : null
        }
      >
        {summary ? (
          <ServerDossierOverview
            summary={summary}
            idPrefix={view.idPrefix}
            onSeeAll={view.onSeeAll}
          />
        ) : null}
      </DossierOverviewBody>
    </>
  );
}
