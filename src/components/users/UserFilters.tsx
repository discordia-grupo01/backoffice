import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SearchInput } from "@/components/ui/SearchInput";
import { ToggleGroup, type ToggleOption } from "@/components/ui/ToggleGroup";
import type { UserStatusFilter } from "@/types/users.types";

const STATUS_OPTIONS: ToggleOption<UserStatusFilter>[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "suspended", label: "Suspendidos" },
];

interface UserFiltersProps {
  query: string;
  status: UserStatusFilter;
  resultCount: number;
  hasActiveFilters: boolean;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: UserStatusFilter) => void;
  onClear: () => void;
}

export function UserFilters({
  query,
  status,
  resultCount,
  hasActiveFilters,
  onQueryChange,
  onStatusChange,
  onClear,
}: UserFiltersProps) {
  return (
    <div className="space-y-3">
      <Card className="flex flex-col gap-3 rounded-xl p-3 @3xl:flex-row @3xl:items-center @3xl:p-4">
        <div className="@3xl:flex-1">
          <SearchInput
            label="Buscar por nombre, usuario o email"
            placeholder="Nombre, usuario o email"
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
      </Card>

      <div className="flex min-h-8 items-center justify-between gap-3 px-1">
        <p aria-live="polite" className="text-content-subtle font-mono text-xs">
          {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
        </p>
        {hasActiveFilters ? (
          <Button variant="secondary" size="sm" onClick={onClear}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>
    </div>
  );
}
