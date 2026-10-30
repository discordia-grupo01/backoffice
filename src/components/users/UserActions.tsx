import { ActionMenu } from "@/components/ui/ActionMenu";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { PlatformUser } from "@/types/users.types";

export interface UserActionHandlers {
  onViewDossier: (user: PlatformUser) => void;
  onSuspend: (user: PlatformUser) => void;
  onReactivate: (user: PlatformUser) => void;
}

interface UserActionsProps extends UserActionHandlers {
  user: PlatformUser;
  className?: string;
  /** "Ver expediente" ocupa todo el ancho libre (en las cards). */
  stretch?: boolean;
}

/** "Ver expediente" y un menú "⋯" con suspender o reactivar. */
export function UserActions({
  user,
  onViewDossier,
  onSuspend,
  onReactivate,
  className,
  stretch = false,
}: UserActionsProps) {
  const isSuspended = user.status === "suspended";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="secondary"
        size="sm"
        className={cn("whitespace-nowrap", stretch && "flex-1")}
        aria-label={`Ver expediente de ${user.name}`}
        onClick={() => onViewDossier(user)}
      >
        Ver expediente
      </Button>
      <ActionMenu
        label={`Más acciones para ${user.name}`}
        items={[
          isSuspended
            ? {
                label: "Reactivar usuario",
                tone: "positive",
                onSelect: () => onReactivate(user),
              }
            : {
                label: "Suspender usuario",
                tone: "caution",
                onSelect: () => onSuspend(user),
              },
        ]}
      />
    </div>
  );
}
