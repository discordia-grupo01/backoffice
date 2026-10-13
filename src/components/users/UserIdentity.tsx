import { Avatar } from "@/components/ui/Avatar";
import type { PlatformUser } from "@/types/users.types";

export function UserIdentity({
  user,
}: {
  user: Pick<PlatformUser, "displayName" | "username">;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={user.displayName} />
      <div className="min-w-0">
        <p className="truncate font-medium">{user.displayName}</p>
        <p className="text-content-subtle truncate font-mono text-xs">
          {user.username}
        </p>
      </div>
    </div>
  );
}
