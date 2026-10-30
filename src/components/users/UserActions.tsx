import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { PlatformUser } from "@/types/users.types";

export interface UserActionHandlers {
  onViewDossier: (user: PlatformUser) => void;
}

interface UserActionsProps extends UserActionHandlers {
  user: PlatformUser;
  className?: string;
}

/** "Ver expediente": suspender y reactivar viven en el expediente. */
export function UserActions({
  user,
  onViewDossier,
  className,
}: UserActionsProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={cn("whitespace-nowrap", className)}
      aria-label={`Ver expediente de ${user.name}`}
      onClick={() => onViewDossier(user)}
    >
      Ver expediente
    </Button>
  );
}
