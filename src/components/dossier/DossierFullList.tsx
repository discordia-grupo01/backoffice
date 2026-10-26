"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useId, type ReactNode, type Ref } from "react";

import { Button } from "@/components/ui/Button";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { StateBox } from "@/components/ui/StateBox";
import type { PagedListStatus } from "@/hooks/usePagedList";
import { cn } from "@/lib/cn";

import { DossierEmpty } from "./DossierOverview";

const SECTION_LOAD_ERROR =
  "No pudimos cargar esta sección del expediente. Revisá tu conexión e intentá de nuevo.";

interface PagedSection<T> {
  items: T[];
  total: number;
  status: PagedListStatus;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  retry: () => void;
}

interface DossierFullListProps<T> {
  header: ReactNode;
  title: string;
  empty: string;
  list: PagedSection<T>;
  renderItems: (items: T[]) => ReactNode;
  onBack: () => void;
  backRef: Ref<HTMLButtonElement>;
}

export function DossierFullList<T>({
  header,
  title,
  empty,
  list,
  renderItems,
  onBack,
  backRef,
}: DossierFullListProps<T>) {
  const { items, total, status, page, pageSize, setPage, retry } = list;
  const hasData = items.length > 0;
  const headingId = useId();

  function renderBody() {
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
          {SECTION_LOAD_ERROR}
        </StateBox>
      );
    }
    if (status === "loading" && !hasData) {
      return (
        <div aria-busy="true" aria-label="Cargando" className="space-y-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-[62px] w-full rounded-xl" />
          ))}
        </div>
      );
    }
    if (!hasData) return <DossierEmpty>{empty}</DossierEmpty>;
    return (
      <div
        aria-busy={status === "loading"}
        className={cn(
          "transition-opacity",
          status === "loading" && "opacity-60",
        )}
      >
        {renderItems(items)}
      </div>
    );
  }

  return (
    <>
      {header}

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <button
          ref={backRef}
          type="button"
          onClick={onBack}
          className="text-content-muted hover:text-content focus-visible:ring-bo -ml-1 flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver al expediente
        </button>

        <section aria-labelledby={headingId} className="mt-5">
          <h3
            id={headingId}
            className="font-display mb-2 text-sm font-semibold"
          >
            {title}{" "}
            {status === "success" ? (
              <span className="text-content-muted font-sans font-medium tabular-nums">
                ({total})
              </span>
            ) : null}
          </h3>
          {renderBody()}
        </section>

        {hasData ? (
          <div className="mt-6">
            <PaginationBar
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
