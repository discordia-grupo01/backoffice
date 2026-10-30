import { CardGrid } from "@/components/ui/CardGrid";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import type { ViewMode } from "@/hooks/useViewMode";
import type { PlatformUser } from "@/types/users.types";

import type { UserActionHandlers } from "./UserActions";
import { UserCard } from "./UserCard";
import { UsersTable } from "./UsersTable";

interface UsersListProps extends UserActionHandlers {
  users: readonly PlatformUser[];
  view: ViewMode;
}

export function UsersList({ users, view, ...handlers }: UsersListProps) {
  return (
    <ViewSwitch
      view={view}
      table={<UsersTable users={users} {...handlers} />}
      cards={
        <CardGrid>
          {users.map((user) => (
            <li key={user.id}>
              <UserCard user={user} {...handlers} />
            </li>
          ))}
        </CardGrid>
      }
    />
  );
}
