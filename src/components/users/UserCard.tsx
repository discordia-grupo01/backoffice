import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardStat } from "@/components/ui/CardStat";
import { cn } from "@/lib/cn";
import { formatDate } from "@/utils/formatDate";
import type { PlatformUser } from "@/types/users.types";

import { UserStatusBadge } from "./UserStatusBadge";

interface UserCardProps {
  user: PlatformUser;
  onViewDossier: (user: PlatformUser) => void;
}

export function UserCard({ user, onViewDossier }: UserCardProps) {
  return (
    <Card
      as="article"
      className={cn(
        "flex h-full flex-col gap-4 rounded-xl p-5",
        user.status === "suspended" && "border-danger/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={user.name} size={40} />
          <div className="min-w-0">
            <p className="truncate font-medium" title={user.name}>
              {user.name}
            </p>
            <p
              className="text-content-muted truncate font-mono text-xs"
              title={user.email}
            >
              {user.email}
            </p>
          </div>
        </div>
        <UserStatusBadge status={user.status} />
      </div>

      <dl className="border-line border-t pt-4">
        <CardStat label="Registro">{formatDate(user.created_at)}</CardStat>
      </dl>

      <Button
        variant="secondary"
        size="sm"
        className="mt-auto w-full"
        aria-label={`Ver expediente de ${user.name}`}
        onClick={() => onViewDossier(user)}
      >
        Ver expediente
      </Button>
    </Card>
  );
}
