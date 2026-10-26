"use client";

import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

import { Dialog } from "@/components/ui/Dialog";

import { useDossierHistory } from "./hooks/useDossierHistory";
import { seeAllButtonId } from "./DossierOverview";

export interface DossierView<S extends string> {
  titleId: string;
  idPrefix: string;
  section: S | null;
  onSeeAll: (section: S) => void;
  onBack: () => void;
  onClose: () => void;
  backRef: RefObject<HTMLButtonElement>;
}

interface DossierDialogProps<S extends string> {
  contentKey: string | null;
  onClose: () => void;
  children: (view: DossierView<S>) => ReactNode;
}

export function DossierDialog<S extends string>({
  contentKey,
  onClose,
  children,
}: DossierDialogProps<S>) {
  const titleId = useId();
  const history = useDossierHistory<S>(contentKey !== null, onClose);

  return (
    <Dialog
      open={contentKey !== null}
      onClose={history.close}
      labelledBy={titleId}
      className="sm:w-[min(100vw-3rem,40rem)]"
    >
      {contentKey !== null ? (
        <DossierViewContent
          key={contentKey}
          titleId={titleId}
          section={history.section}
          onSeeAll={history.openSection}
          onBack={history.backToOverview}
          onClose={history.close}
        >
          {children}
        </DossierViewContent>
      ) : null}
    </Dialog>
  );
}

function DossierViewContent<S extends string>({
  children,
  ...props
}: Omit<DossierView<S>, "idPrefix" | "backRef"> & {
  children: (view: DossierView<S>) => ReactNode;
}) {
  const idPrefix = useId();
  const backRef = useRef<HTMLButtonElement>(null);
  const lastSection = useRef<S | null>(null);
  const { section } = props;

  useEffect(() => {
    if (section) {
      backRef.current?.focus();
      lastSection.current = section;
    } else if (lastSection.current) {
      document
        .getElementById(seeAllButtonId(idPrefix, lastSection.current))
        ?.focus();
    }
  }, [section, idPrefix]);

  return <>{children({ ...props, idPrefix, backRef })}</>;
}
