import { FilterSummary } from "@/components/ui/FilterSummary";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { ToggleGroup, type ToggleOption } from "@/components/ui/ToggleGroup";
import { ViewModeToggle } from "@/components/ui/ViewModeToggle";
import type { ViewMode } from "@/hooks/useViewMode";
import type {
  IncidentServiceFilter,
  IncidentTypeFilter,
} from "@/types/status.types";
import { isServiceId, PLATFORM_SERVICES } from "@/utils/incidents";

import {
  HISTORY_PERIOD_OPTIONS,
  type HistoryPeriod,
} from "./utils/historyPeriod";

const TYPE_OPTIONS: ToggleOption<IncidentTypeFilter>[] = [
  { value: "all", label: "Todos" },
  { value: "degraded", label: "Degradación" },
  { value: "maintenance", label: "Mantenimiento" },
];

const SERVICE_OPTIONS = [
  { value: "all", label: "Todos los servicios" },
  ...PLATFORM_SERVICES.map(({ id, label }) => ({ value: id, label })),
];

interface IncidentHistoryFiltersProps {
  query: string;
  type: IncidentTypeFilter;
  service: IncidentServiceFilter;
  period: HistoryPeriod;
  countLabel: string;
  hasActiveFilters: boolean;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onQueryChange: (query: string) => void;
  onTypeChange: (type: IncidentTypeFilter) => void;
  onServiceChange: (service: IncidentServiceFilter) => void;
  onPeriodChange: (period: HistoryPeriod) => void;
  onClear: () => void;
}

export function IncidentHistoryFilters({
  query,
  type,
  service,
  period,
  countLabel,
  hasActiveFilters,
  view,
  onViewChange,
  onQueryChange,
  onTypeChange,
  onServiceChange,
  onPeriodChange,
  onClear,
}: IncidentHistoryFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 @4xl:flex-row @4xl:items-center">
        <div className="@4xl:flex-1">
          <SearchInput
            label="Buscar por título o descripción"
            placeholder="Título o descripción"
            value={query}
            onChange={onQueryChange}
          />
        </div>
        <ToggleGroup
          label="Tipo"
          options={TYPE_OPTIONS}
          value={type}
          onChange={onTypeChange}
          className="w-full @4xl:w-auto"
        />
        <div className="grid grid-cols-1 gap-3 min-[481px]:grid-cols-2 @4xl:w-[25rem]">
          <Select
            label="Servicio"
            variant="toolbar"
            options={SERVICE_OPTIONS}
            value={service}
            onChange={(next) =>
              onServiceChange(isServiceId(next) ? next : "all")
            }
          />
          <Select
            label="Período"
            variant="toolbar"
            options={HISTORY_PERIOD_OPTIONS}
            value={period}
            onChange={(next) => {
              const option = HISTORY_PERIOD_OPTIONS.find(
                (item) => item.value === next,
              );
              if (option) onPeriodChange(option.value);
            }}
          />
        </div>
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
