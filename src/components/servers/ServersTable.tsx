import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatDate } from "@/utils/formatDate";
import { formatMembers } from "@/utils/formatNumber";
import type { PlatformServer } from "@/types/servers.types";

import { ServerActions, type ServerActionHandlers } from "./ServerActions";
import { ServerIdentity } from "./ServerIdentity";
import { ServerStatusBadge } from "./ServerStatusBadge";

interface ServersTableProps extends ServerActionHandlers {
  servers: readonly PlatformServer[];
}

export function ServersTable({ servers, ...handlers }: ServersTableProps) {
  const columns: Column<PlatformServer>[] = [
    {
      header: "Servidor",
      cell: (server) => <ServerIdentity server={server} showOwner={false} />,
    },
    {
      header: "Dueño",
      width: "14rem",
      cellClassName: "text-content-muted truncate",
      cell: (server) => (
        <span title={server.owner_name ?? undefined}>
          {server.owner_name ?? "Sin datos"}
        </span>
      ),
    },
    {
      header: "Miembros",
      width: "8rem",
      align: "right",
      cellClassName: "font-mono text-xs tabular-nums",
      cell: (server) => formatMembers(server.member_count),
    },
    {
      header: "Creación",
      width: "8rem",
      cellClassName: "font-mono text-xs tabular-nums",
      cell: (server) => formatDate(server.created_at),
    },
    {
      header: "Estado",
      width: "8rem",
      cell: (server) => <ServerStatusBadge server={server} />,
    },
    {
      header: "Acciones",
      width: "17rem",
      cell: (server) => <ServerActions server={server} {...handlers} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={servers}
      getRowKey={(server) => server.id}
      minWidthClass="min-w-[1140px]"
    />
  );
}
