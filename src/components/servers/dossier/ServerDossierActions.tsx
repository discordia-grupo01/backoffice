import { Button } from "@/components/ui/Button";
import type { PlatformServer } from "@/types/servers.types";

export interface ServerDossierActionHandlers {
  onSuspend: (server: PlatformServer) => void;
  onReactivate: (server: PlatformServer) => void;
  onDelete: (server: PlatformServer) => void;
}

export function ServerDossierActions({
  server,
  onSuspend,
  onReactivate,
  onDelete,
}: ServerDossierActionHandlers & { server: PlatformServer }) {
  const isSuspended = Boolean(server.suspended_at);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        variant={isSuspended ? "positive" : "caution"}
        className="sm:flex-1"
        onClick={() => (isSuspended ? onReactivate(server) : onSuspend(server))}
      >
        {isSuspended ? "Reactivar servidor" : "Suspender servidor"}
      </Button>
      <Button
        variant="danger"
        className="sm:flex-1"
        onClick={() => onDelete(server)}
      >
        Eliminar servidor
      </Button>
    </div>
  );
}
