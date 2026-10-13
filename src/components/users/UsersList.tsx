import type { PlatformUser } from "@/types/users.types";

import { UserCard } from "./UserCard";
import { UsersTable } from "./UsersTable";

interface UsersListProps {
  users: readonly PlatformUser[];
  onViewDossier: (user: PlatformUser) => void;
}

export function UsersList({ users, onViewDossier }: UsersListProps) {
  return (
    <>
      <UsersTable users={users} onViewDossier={onViewDossier} />
      <ul className="space-y-3 @3xl:hidden">
        {users.map((user) => (
          <li key={user.id}>
            <UserCard user={user} onViewDossier={onViewDossier} />
          </li>
        ))}
      </ul>
    </>
  );
}
