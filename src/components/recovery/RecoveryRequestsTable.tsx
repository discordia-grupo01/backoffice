import { DataTable, type Column } from "@/components/ui/DataTable";
import { UserIdentity } from "@/components/users/UserIdentity";
import type { RecoveryRequest } from "@/types/recovery.types";
import { formatDateTime } from "@/utils/formatDate";
import { requesterName } from "@/utils/recoveryText";

import {
  RecoveryRequestAction,
  type RecoveryRequestActionHandlers,
} from "./RecoveryRequestAction";
import { RecoveryMessage } from "./RecoveryMessage";
import { RecoveryStatusBadge } from "./RecoveryStatusBadge";

interface RecoveryRequestsTableProps extends RecoveryRequestActionHandlers {
  requests: readonly RecoveryRequest[];
}

export function RecoveryRequestsTable({
  requests,
  ...handlers
}: RecoveryRequestsTableProps) {
  const columns: Column<RecoveryRequest>[] = [
    {
      header: "Usuario",
      width: "22%",
      cell: (request) => (
        <UserIdentity user={{ name: requesterName(request) }} />
      ),
    },
    {
      header: "Email",
      width: "20%",
      cellClassName: "text-content-muted truncate font-mono text-xs",
      cell: (request) =>
        request.user ? (
          <span title={request.user.email}>{request.user.email}</span>
        ) : null,
    },
    {
      header: "Enviada",
      width: "9.5rem",
      cellClassName: "font-mono text-xs",
      cell: (request) => formatDateTime(request.requested_at),
    },
    {
      header: "Mensaje",
      cell: (request) => (
        <RecoveryMessage
          message={request.message}
          className="truncate text-xs"
        />
      ),
    },
    {
      header: "Estado",
      width: "7.5rem",
      cell: (request) => <RecoveryStatusBadge status={request.status} />,
    },
    {
      header: "Acciones",
      width: "9rem",
      cell: (request) => (
        <RecoveryRequestAction request={request} {...handlers} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={requests}
      getRowKey={(request) => request.id}
      minWidthClass="min-w-[860px]"
    />
  );
}
