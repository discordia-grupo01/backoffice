"use client";

import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

import { Dialog } from "@/components/ui/Dialog";

import type { DossierUrl } from "./hooks/useDossierUrl";
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
  nav: DossierUrl<S>;
  children: (view: DossierView<S> & { subjectId: string }) => ReactNode;
}

export function DossierDialog<S extends string>({
  nav,
  children,
}: DossierDialogProps<S>) {
  const titleId = useId();
  const { subjectId } = nav;

  return (
    <Dialog
      open={subjectId !== null}
      onClose={nav.close}
      labelledBy={titleId}
      className="sm:w-[min(100vw-3rem,40rem)]"
    >
      {subjectId !== null ? (
        <DossierViewContent
          key={subjectId}
          titleId={titleId}
          section={nav.section}
          onSeeAll={nav.openSection}
          onBack={nav.backToOverview}
          onClose={nav.close}
        >
          {(view) => children({ ...view, subjectId })}
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
