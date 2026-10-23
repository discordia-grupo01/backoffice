import { CardGrid } from "@/components/ui/CardGrid";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import type { ViewMode } from "@/hooks/useViewMode";
import type { PlatformUser } from "@/types/users.types";

import { UserCard } from "./UserCard";
import { UsersTable } from "./UsersTable";

interface UsersListProps {
  users: readonly PlatformUser[];
  view: ViewMode;
  onViewDossier: (user: PlatformUser) => void;
}

export function UsersList({ users, view, onViewDossier }: UsersListProps) {
  return (
    <ViewSwitch
      view={view}
      table={<UsersTable users={users} onViewDossier={onViewDossier} />}
      cards={
        <CardGrid>
          {users.map((user) => (
            <li key={user.id}>
              <UserCard user={user} onViewDossier={onViewDossier} />
            </li>
          ))}
        </CardGrid>
      }
    />
  );
}
