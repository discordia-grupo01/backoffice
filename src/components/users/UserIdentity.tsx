import { Avatar } from "@/components/ui/Avatar";
import { imageSrc } from "@/utils/imageSrc";
import type { PlatformUser } from "@/types/users.types";

interface UserIdentityProps {
  user: Pick<PlatformUser, "name"> & Partial<Pick<PlatformUser, "avatar_url">>;
}

export function UserIdentity({ user }: UserIdentityProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={user.name} src={imageSrc(user.avatar_url)} />
      <p className="truncate font-medium">{user.name}</p>
    </div>
  );
}
