import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { PlatformServer } from "@/types/servers.types";

export interface ServerActionHandlers {
  onViewDossier: (server: PlatformServer) => void;
  onSuspend: (server: PlatformServer) => void;
  onReactivate: (server: PlatformServer) => void;
}

interface ServerActionsProps extends ServerActionHandlers {
  server: PlatformServer;
  className?: string;
}

/** "Ver expediente" y "Suspender" (o "Reactivar" si el servidor está suspendido). */
export function ServerActions({
  server,
  onViewDossier,
  onSuspend,
  onReactivate,
  className,
}: ServerActionsProps) {
  const isSuspended = Boolean(server.suspended_at);

  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        variant="secondary"
        size="sm"
        className="flex-1"
        aria-label={`Ver expediente de ${server.name}`}
        onClick={() => onViewDossier(server)}
      >
        Ver expediente
      </Button>
      {isSuspended ? (
        <Button
          variant="positive"
          size="sm"
          className="flex-1"
          aria-label={`Reactivar ${server.name}`}
          onClick={() => onReactivate(server)}
        >
          Reactivar
        </Button>
      ) : (
        <Button
          variant="caution"
          size="sm"
          className="flex-1"
          aria-label={`Suspender ${server.name}`}
          onClick={() => onSuspend(server)}
        >
          Suspender
        </Button>
      )}
    </div>
  );
}
