import { X } from "lucide-react";

import { SearchInput } from "@/components/ui/SearchInput";
import { ViewModeToggle } from "@/components/ui/ViewModeToggle";
import type { ViewMode } from "@/hooks/useViewMode";
import { ToggleGroup, type ToggleOption } from "@/components/ui/ToggleGroup";
import type { UserStatusFilter } from "@/types/users.types";

const STATUS_OPTIONS: ToggleOption<UserStatusFilter>[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "pending", label: "Pendientes" },
  { value: "suspended", label: "Suspendidos" },
];

interface UserFiltersProps {
  query: string;
  status: UserStatusFilter;
  /** Total de resultados ("26 resultados"); vacío mientras carga o falla. */
  countLabel: string;
  hasActiveFilters: boolean;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: UserStatusFilter) => void;
  onClear: () => void;
}

export function UserFilters({
  query,
  status,
  countLabel,
  hasActiveFilters,
  view,
  onViewChange,
  onQueryChange,
  onStatusChange,
  onClear,
}: UserFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 @3xl:flex-row @3xl:items-center">
        <div className="@3xl:flex-1">
          <SearchInput
            label="Buscar por nombre o email"
            placeholder="Nombre o email"
            value={query}
            onChange={onQueryChange}
          />
        </div>
        <ToggleGroup
          label="Estado"
          options={STATUS_OPTIONS}
          value={status}
          onChange={onStatusChange}
          className="w-full @3xl:w-auto"
        />
        <ViewModeToggle value={view} onChange={onViewChange} />
      </div>

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
    </div>
  );
}
