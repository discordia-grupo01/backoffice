import { ActionMenu } from "@/components/ui/ActionMenu";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { PlatformServer } from "@/types/servers.types";

export interface ServerActionHandlers {
  onViewDossier: (server: PlatformServer) => void;
  onSuspend: (server: PlatformServer) => void;
  onReactivate: (server: PlatformServer) => void;
  onDelete: (server: PlatformServer) => void;
}

interface ServerActionsProps extends ServerActionHandlers {
  server: PlatformServer;
  className?: string;
  stretch?: boolean;
}

export function ServerActions({
  server,
  onViewDossier,
  onSuspend,
  onReactivate,
  onDelete,
  className,
  stretch = false,
}: ServerActionsProps) {
  const isSuspended = Boolean(server.suspended_at);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="secondary"
        size="sm"
        className={cn("whitespace-nowrap", stretch && "flex-1")}
        aria-label={`Ver expediente de ${server.name}`}
        onClick={() => onViewDossier(server)}
      >
        Ver expediente
      </Button>
      <ActionMenu
        label={`Más acciones para ${server.name}`}
        items={[
          isSuspended
            ? {
                label: "Reactivar servidor",
                tone: "positive",
                onSelect: () => onReactivate(server),
              }
            : {
                label: "Suspender servidor",
                tone: "caution",
                onSelect: () => onSuspend(server),
              },
          {
            label: "Eliminar servidor",
            tone: "danger",
            separated: true,
            onSelect: () => onDelete(server),
          },
        ]}
      />
    </div>
  );
}
