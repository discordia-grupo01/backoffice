"use client";

import { AlertTriangle, ShieldOff } from "lucide-react";
import { useEffect, useId, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { StateBox } from "@/components/ui/StateBox";
import type { DossierSection, PlatformUser } from "@/types/users.types";

import { useDossierHistory } from "./hooks/useDossierHistory";
import {
  USER_DOSSIER_LOAD_ERROR,
  useUserDossier,
} from "./hooks/useUserDossier";
import { UserDossierActions } from "./UserDossierActions";
import { UserDossierHeader } from "./UserDossierHeader";
import {
  seeAllButtonId,
  UserDossierOverview,
  UserDossierOverviewSkeleton,
} from "./UserDossierOverview";
import { UserDossierSection } from "./UserDossierSection";

interface UserDossierDialogProps {
  user: PlatformUser | null;
  onClose: () => void;
  onSuspend: (user: PlatformUser) => void;
  onReactivate: (user: PlatformUser) => void;
}

export function UserDossierDialog({
  user,
  onClose,
  onSuspend,
  onReactivate,
}: UserDossierDialogProps) {
  const titleId = useId();
  const history = useDossierHistory(user !== null, onClose);

  return (
    <Dialog
      open={user !== null}
      onClose={history.close}
      labelledBy={titleId}
      className="sm:w-[min(100vw-3rem,40rem)]"
    >
      {user ? (
        <DossierContent
          key={user.id}
          user={user}
          titleId={titleId}
          openSection={history.section}
          onSeeAll={history.openSection}
          onBack={history.backToOverview}
          onClose={history.close}
          onSuspend={onSuspend}
          onReactivate={onReactivate}
        />
      ) : null}
    </Dialog>
  );
}

interface DossierContentProps extends Omit<UserDossierDialogProps, "user"> {
  user: PlatformUser;
  titleId: string;
  openSection: DossierSection | null;
  onSeeAll: (section: DossierSection) => void;
  onBack: () => void;
}

function DossierContent({
  user,
  titleId,
  openSection,
  onSeeAll,
  onBack,
  onClose,
  onSuspend,
  onReactivate,
}: DossierContentProps) {
  const idPrefix = useId();
  const lastSection = useRef<DossierSection | null>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const { status, summary, retry } = useUserDossier(user);
  const current = summary?.user ?? user;

  useEffect(() => {
    if (openSection) {
      backRef.current?.focus();
      lastSection.current = openSection;
    } else if (lastSection.current) {
      document
        .getElementById(seeAllButtonId(idPrefix, lastSection.current))
        ?.focus();
    }
  }, [openSection, idPrefix]);

  const actions = (
    <UserDossierActions
      user={current}
      onSuspend={onSuspend}
      onReactivate={onReactivate}
    />
  );

  if (openSection) {
    return (
      <UserDossierSection
        ref={backRef}
        user={current}
        section={openSection}
        titleId={titleId}
        onBack={onBack}
        onClose={onClose}
      />
    );
  }

  function renderBody() {
    if (status === "forbidden") {
      return (
        <StateBox role="alert" icon={ShieldOff} title="No tenés permisos">
          Los expedientes son solo para el staff de Discordia. Si creés que es
          un error, contactá a un administrador.
        </StateBox>
      );
    }
    if (status === "error") {
      return (
        <StateBox
          role="alert"
          icon={AlertTriangle}
          title="Algo salió mal"
          action={
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={retry}
            >
              Reintentar
            </Button>
          }
        >
          {USER_DOSSIER_LOAD_ERROR}
        </StateBox>
      );
    }
    if (status === "loading" || !summary)
      return <UserDossierOverviewSkeleton />;
    return (
      <UserDossierOverview
        summary={summary}
        idPrefix={idPrefix}
        onSeeAll={onSeeAll}
      />
    );
  }

  return (
    <>
      <UserDossierHeader user={current} titleId={titleId} onClose={onClose} />
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
        {renderBody()}
        {status === "forbidden" ? null : actions}
      </div>
    </>
  );
}
