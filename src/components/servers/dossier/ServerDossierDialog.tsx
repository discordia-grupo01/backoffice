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
  server: PlatformServer | null;
  onClose: () => void;
}

export function ServerDossierDialog({
  server,
  onClose,
  ...actions
}: ServerDossierDialogProps) {
  return (
    <DossierDialog<ServerDossierSection>
      contentKey={server?.id ?? null}
      onClose={onClose}
    >
      {(view) =>
        server ? (
          <ServerDossierContent server={server} view={view} {...actions} />
        ) : null
      }
    </DossierDialog>
  );
}

const SKELETON_BLOCKS = ["chart", "list", "list"] as const;

function ServerDossierContent({
  server,
  view,
  ...actions
}: ServerDossierActionHandlers & {
  server: PlatformServer;
  view: DossierView<ServerDossierSection>;
}) {
  const { status, summary, retry } = useDossierSummary(
    server,
    getServerDossierSummary,
  );
  const current = summary?.server ?? server;

  const header = (
    <DossierHeader
      name={current.name}
      avatar={<Avatar name={current.name} size={44} className="rounded-xl" />}
      titleId={view.titleId}
      onClose={view.onClose}
    />
  );

  if (view.section) {
    return (
      <SectionScreen
        server={current}
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
        actions={<ServerDossierActions server={current} {...actions} />}
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
