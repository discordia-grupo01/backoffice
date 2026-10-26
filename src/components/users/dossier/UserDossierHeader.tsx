import { X } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import type { PlatformUser } from "@/types/users.types";

interface UserDossierHeaderProps {
  user: PlatformUser;
  titleId: string;
  onClose: () => void;
}

export function UserDossierHeader({
  user,
  titleId,
  onClose,
}: UserDossierHeaderProps) {
  return (
    <header className="border-line flex items-center gap-3 border-b px-5 py-4">
      <Avatar name={user.name} size={44} />
      <h2
        id={titleId}
        className="font-display min-w-0 flex-1 truncate text-xl leading-tight font-semibold tracking-tight"
      >
        <span className="sr-only">Expediente de </span>
        {user.name}
      </h2>
      <div className="-mr-1">
        <IconButton icon={X} label="Cerrar expediente" onClick={onClose} />
      </div>
    </header>
  );
}
