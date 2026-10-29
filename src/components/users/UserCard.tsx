import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Fact, FactGrid } from "@/components/ui/Fact";
import { cn } from "@/lib/cn";
import { formatDate } from "@/utils/formatDate";
import type { PlatformUser } from "@/types/users.types";

import { UserActions, type UserActionHandlers } from "./UserActions";
import { UserStatusBadge } from "./UserStatusBadge";

interface UserCardProps extends UserActionHandlers {
  user: PlatformUser;
}

export function UserCard({ user, ...handlers }: UserCardProps) {
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

      <FactGrid className="border-line border-t pt-4">
        <Fact label="Fecha de registro" boxed={false}>
          {formatDate(user.created_at)}
        </Fact>
      </FactGrid>

      <UserActions user={user} className="mt-auto" stretch {...handlers} />
    </Card>
  );
}
