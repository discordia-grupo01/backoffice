import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
      className="flex items-start gap-3 rounded-xl p-4 @2xl:items-center"
    >
      <Avatar name={user.name} />
      <div className="min-w-0 flex-1 @2xl:flex @2xl:items-center @2xl:gap-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-medium">{user.name}</p>
            <div className="@2xl:hidden">
              <UserStatusBadge status={user.status} />
            </div>
          </div>
          <p
            className="text-content-muted truncate font-mono text-xs"
            title={user.email}
          >
            {user.email}
          </p>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-3 @2xl:mt-0 @2xl:shrink-0 @2xl:gap-5">
          <p className="text-content-subtle text-xs tabular-nums @2xl:w-24">
            <span className="@2xl:hidden">Registro </span>
            {formatDate(user.created_at)}
          </p>
          <div className="hidden @2xl:block @2xl:w-24">
            <UserStatusBadge status={user.status} />
          </div>
          <Button
            variant="secondary"
            size="sm"
            aria-label={`Ver expediente de ${user.name}`}
            onClick={() => onViewDossier(user)}
          >
            Ver expediente
          </Button>
        </div>
      </div>
    </Card>
  );
}
