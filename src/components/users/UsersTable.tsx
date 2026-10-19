import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/utils/formatDate";
import type { PlatformUser } from "@/types/users.types";

import { UserIdentity } from "./UserIdentity";
import { UserStatusBadge } from "./UserStatusBadge";

const COLUMNS = ["Usuario", "Email", "Registro", "Estado", "Acciones"];

interface UsersTableProps {
  users: readonly PlatformUser[];
  onViewDossier: (user: PlatformUser) => void;
}

export function UsersTable({ users, onViewDossier }: UsersTableProps) {
  return (
    <Card className="hidden overflow-hidden rounded-xl @3xl:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="bg-surface-sunken">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="text-content-subtle px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-line border-t">
                <td className="max-w-60 px-4 py-3">
                  <UserIdentity user={user} />
                </td>
                <td className="text-content-muted px-4 py-3 font-mono text-xs">
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
