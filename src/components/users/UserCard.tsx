import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/utils/formatDate";
import type { PlatformUser } from "@/types/users.types";

import { UserIdentity } from "./UserIdentity";
import { UserStatusBadge } from "./UserStatusBadge";

interface UserCardProps {
  user: PlatformUser;
  onViewDossier: (user: PlatformUser) => void;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-input min-w-0 rounded-lg p-2 text-center">
      <dt className="text-content-subtle mb-1 truncate text-xs">{label}</dt>
      <dd className="truncate font-mono text-xs font-semibold">{value}</dd>
    </div>
  );
}

export function UserCard({ user, onViewDossier }: UserCardProps) {
  return (
    <Card as="article" className="rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <UserIdentity user={user} />
        <UserStatusBadge status={user.status} />
      </div>
      <p className="text-content-muted mt-3 truncate font-mono text-xs">
        {user.email}
      </p>
      <dl className="my-4 grid grid-cols-3 gap-2">
        <Stat label="Registro" value={formatDate(user.registeredAt)} />
        <Stat label="Servidores" value={String(user.serversCount)} />
        <Stat label="Reportes" value={String(user.reportsCount)} />
      </dl>
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={() => onViewDossier(user)}
      >
        Ver expediente
      </Button>
    </Card>
  );
}
