import { FilterSummary } from "@/components/ui/FilterSummary";
import { SearchInput } from "@/components/ui/SearchInput";
import { ToggleGroup, type ToggleOption } from "@/components/ui/ToggleGroup";
import { ViewModeToggle } from "@/components/ui/ViewModeToggle";
import type { ViewMode } from "@/hooks/useViewMode";

interface ListFiltersProps<S extends string> {
  query: string;
  status: S;
  statusOptions: readonly ToggleOption<S>[];
  countLabel: string;
  hasActiveFilters: boolean;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: S) => void;
  onClear: () => void;
}

export function ListFilters<S extends string>({
  query,
  status,
  statusOptions,
  countLabel,
  hasActiveFilters,
  view,
  onViewChange,
  onQueryChange,
  onStatusChange,
  onClear,
}: ListFiltersProps<S>) {
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
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
          className="w-full @3xl:w-auto"
        />
        <ViewModeToggle value={view} onChange={onViewChange} />
      </div>

      <FilterSummary
        countLabel={countLabel}
        hasActiveFilters={hasActiveFilters}
        onClear={onClear}
      />
    </div>
  );
}
