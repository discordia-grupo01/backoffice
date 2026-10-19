import { Avatar } from "@/components/ui/Avatar";
import type { PlatformUser } from "@/types/users.types";

export function UserIdentity({ user }: { user: Pick<PlatformUser, "name"> }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={user.name} />
      <p className="truncate font-medium">{user.name}</p>
    </div>
  );
}
