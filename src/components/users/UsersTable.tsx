import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatDate } from "@/utils/formatDate";
import type { PlatformUser } from "@/types/users.types";

import { UserIdentity } from "./UserIdentity";
import { UserStatusBadge } from "./UserStatusBadge";

interface UsersTableProps {
  users: readonly PlatformUser[];
  onViewDossier: (user: PlatformUser) => void;
}

export function UsersTable({ users, onViewDossier }: UsersTableProps) {
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
      width: "10rem",
      cell: (user) => (
        <Button
          variant="secondary"
          size="sm"
          aria-label={`Ver expediente de ${user.name}`}
          onClick={() => onViewDossier(user)}
        >
          Ver expediente
        </Button>
      ),
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
