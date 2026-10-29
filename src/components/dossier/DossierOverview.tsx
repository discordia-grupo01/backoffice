import { AlertTriangle, ShieldOff } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { StateBox } from "@/components/ui/StateBox";

import type { DossierStatus } from "./hooks/useDossierSummary";

export const DOSSIER_LOAD_ERROR =
  "No pudimos cargar el expediente. Revisá tu conexión e intentá de nuevo.";

interface DossierOverviewBodyProps {
  status: DossierStatus;
  onRetry: () => void;
  skeleton: ReactNode;
  actions: ReactNode;
  children: ReactNode;
}

export function DossierOverviewBody({
  status,
  onRetry,
  skeleton,
  actions,
  children,
}: DossierOverviewBodyProps) {
  function renderContent() {
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
              onClick={onRetry}
            >
              Reintentar
            </Button>
          }
        >
          {DOSSIER_LOAD_ERROR}
        </StateBox>
      );
    }
    if (status === "loading") return skeleton;
    return <div className="space-y-6">{children}</div>;
  }

  return (
    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
      {renderContent()}
      {status === "forbidden" ? null : (
        <div className="border-line border-t pt-5">{actions}</div>
      )}
    </div>
  );
}

export function DossierEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="border-line bg-surface-input text-content-muted rounded-xl border px-4 py-3 text-sm">
      {children}
    </p>
  );
}

export function seeAllButtonId(idPrefix: string, section: string) {
  return `${idPrefix}-see-all-${section}`;
}

interface DossierSectionBlockProps {
  idPrefix: string;
  section: string;
  title: string;
  count?: number;
  shown?: number;
  empty?: string;
  onSeeAll?: () => void;
  children: ReactNode;
}

export function DossierSectionBlock({
  idPrefix,
  section,
  title,
  count,
  shown = 0,
  empty,
  onSeeAll,
  children,
}: DossierSectionBlockProps) {
  const headingId = `${idPrefix}-heading-${section}`;
  const hasCount = count !== undefined;

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 id={headingId} className="font-display text-sm font-semibold">
          {title}
          {hasCount ? (
            <>
              {" "}
              <span className="text-content-muted font-sans font-medium tabular-nums">
                ({count})
              </span>
            </>
          ) : null}
        </h3>
        {hasCount && onSeeAll && count > shown ? (
          <button
            id={seeAllButtonId(idPrefix, section)}
            type="button"
            onClick={onSeeAll}
            aria-label={`Ver todos: ${title}`}
            className="focus-visible:ring-bo -mr-1 shrink-0 cursor-pointer rounded-md px-1 py-0.5 text-[13px] font-semibold text-[color-mix(in_srgb,var(--bo-accent)_65%,var(--text))] hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            Ver todos
          </button>
        ) : null}
      </div>

      {hasCount && count === 0 && empty ? (
        <DossierEmpty>{empty}</DossierEmpty>
      ) : (
        children
      )}
    </section>
  );
}

const SKELETON_HEIGHT = { list: "h-[166px]", chart: "h-52" } as const;

export function DossierOverviewSkeleton({
  blocks,
}: {
  blocks: readonly (keyof typeof SKELETON_HEIGHT)[];
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando expediente"
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-[66px] rounded-xl" />
        ))}
      </div>
      {blocks.map((block, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className={`${SKELETON_HEIGHT[block]} w-full rounded-xl`} />
        </div>
      ))}
    </div>
  );
}
