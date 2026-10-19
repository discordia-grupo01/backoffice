import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/utils/formatDate";
import type { PlatformUser } from "@/types/users.types";

import { UserIdentity } from "./UserIdentity";
import { UserStatusBadge } from "./UserStatusBadge";

/** Ancho fijo por columna, así no cambia con el contenido; Email se queda con lo que sobra. */
const COLUMNS = [
  { label: "Usuario", width: "30%" },
  { label: "Email" },
  { label: "Registro", width: "7.5rem" },
  { label: "Estado", width: "7.5rem" },
  { label: "Acciones", width: "10rem" },
];

interface UsersTableProps {
  users: readonly PlatformUser[];
  onViewDossier: (user: PlatformUser) => void;
}

export function UsersTable({ users, onViewDossier }: UsersTableProps) {
  return (
    <Card className="hidden overflow-hidden rounded-xl @3xl:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed text-sm">
          <colgroup>
            {COLUMNS.map(({ label, width }) => (
              <col key={label} style={width ? { width } : undefined} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-surface-sunken">
              {COLUMNS.map(({ label }) => (
                <th
                  key={label}
                  scope="col"
                  className="text-content-subtle px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-line border-t">
                <td className="px-4 py-3">
                  <UserIdentity user={user} />
                </td>
                <td
                  className="text-content-muted truncate px-4 py-3 font-mono text-xs"
                  title={user.email}
                >
                  {user.email}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-4 py-3">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-label={`Ver expediente de ${user.name}`}
                    onClick={() => onViewDossier(user)}
                  >
                    Ver expediente
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
