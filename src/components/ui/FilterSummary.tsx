import { X } from "lucide-react";

interface FilterSummaryProps {
  countLabel: string;
  hasActiveFilters: boolean;
  onClear: () => void;
}

/** Fila bajo los filtros de un listado: cantidad de resultados y "Limpiar filtros". */
export function FilterSummary({
  countLabel,
  hasActiveFilters,
  onClear,
}: FilterSummaryProps) {
  return (
    <div className="flex min-h-6 items-center justify-between gap-3">
      <p
        aria-live="polite"
        className="text-content-muted text-[13px] tabular-nums"
      >
        {countLabel}
      </p>
      {hasActiveFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="text-content-muted hover:text-content focus-visible:ring-bo -mr-1 flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X size={14} aria-hidden="true" />
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}
