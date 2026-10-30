import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatDate } from "@/utils/formatDate";
import type { PlatformUser } from "@/types/users.types";

import { UserActions, type UserActionHandlers } from "./UserActions";
import { UserIdentity } from "./UserIdentity";
import { UserStatusBadge } from "./UserStatusBadge";

interface UsersTableProps extends UserActionHandlers {
  users: readonly PlatformUser[];
}

export function UsersTable({ users, ...handlers }: UsersTableProps) {
  const columns: Column<PlatformUser>[] = [
    {
      header: "Usuario",
      width: "30%",
      cell: (user) => <UserIdentity user={user} />,
    },
    {
      header: "Email",
      cellClassName: "text-content-muted truncate font-mono text-xs",
      cell: (user) => <span title={user.email}>{user.email}</span>,
    },
    {
      header: "Registro",
      width: "7.5rem",
      cellClassName: "font-mono text-xs",
      cell: (user) => formatDate(user.created_at),
    },
    {
      header: "Estado",
      width: "7.5rem",
      cell: (user) => <UserStatusBadge status={user.status} />,
    },
    {
      header: "Acciones",
      width: "12rem",
      cell: (user) => <UserActions user={user} {...handlers} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={users}
      getRowKey={(user) => user.id}
      minWidthClass="min-w-[760px]"
    />
  );
}
