import type { ComponentProps } from "react";

import { ListFilters } from "@/components/ui/ListFilters";
import type { ToggleOption } from "@/components/ui/ToggleGroup";
import type { UserStatusFilter } from "@/types/users.types";

const STATUS_OPTIONS: ToggleOption<UserStatusFilter>[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "pending", label: "Pendientes" },
  { value: "suspended", label: "Suspendidos" },
];

type UserFiltersProps = Omit<
  ComponentProps<typeof ListFilters<UserStatusFilter>>,
  "statusOptions"
>;

export function UserFilters(props: UserFiltersProps) {
  return <ListFilters statusOptions={STATUS_OPTIONS} {...props} />;
}
