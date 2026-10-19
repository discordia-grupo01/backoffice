import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { PlatformServer } from "@/types/servers.types";

interface ServerIdentityProps {
  server: Pick<PlatformServer, "name" | "owner_name" | "suspended_at">;
}

export function ServerIdentity({ server }: ServerIdentityProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ServerAvatar name={server.name} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium" title={server.name}>
            {server.name}
          </p>
          {server.suspended_at ? <Badge tone="danger">Suspendido</Badge> : null}
        </div>
        <p className="text-content-muted truncate text-xs">
          Dueño: {server.owner_name ?? "sin datos"}
        </p>
      </div>
    </div>
  );
}

/** Cuadrado redondeado, como los íconos de servidor de la app, para no confundirlo con el avatar de una persona. */
export function ServerAvatar({ name }: { name: string }) {
  return <Avatar name={name} size={40} className="rounded-xl" />;
}
