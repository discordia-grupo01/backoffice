import { Badge } from "@/components/ui/Badge";
import type { PlatformServer } from "@/types/servers.types";

export function ServerStatusBadge({
  server,
}: {
  server: Pick<PlatformServer, "suspended_at">;
}) {
  return server.suspended_at ? (
    <Badge tone="danger">Suspendido</Badge>
  ) : (
    <Badge tone="success">Activo</Badge>
  );
}
