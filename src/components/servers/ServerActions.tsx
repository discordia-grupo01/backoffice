import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { PlatformServer } from "@/types/servers.types";

export interface ServerActionHandlers {
  onViewDossier: (server: PlatformServer) => void;
}

interface ServerActionsProps extends ServerActionHandlers {
  server: PlatformServer;
  className?: string;
}

/** "Ver expediente": suspender, reactivar y eliminar viven en el expediente. */
export function ServerActions({
  server,
  onViewDossier,
  className,
}: ServerActionsProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={cn("whitespace-nowrap", className)}
      aria-label={`Ver expediente de ${server.name}`}
      onClick={() => onViewDossier(server)}
    >
      Ver expediente
    </Button>
  );
}
