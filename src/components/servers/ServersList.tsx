import type { PlatformServer } from "@/types/servers.types";

import { ServerCard } from "./ServerCard";

interface ServersListProps {
  servers: readonly PlatformServer[];
  onViewDossier: (server: PlatformServer) => void;
  onSuspend: (server: PlatformServer) => void;
  onReactivate: (server: PlatformServer) => void;
}

export function ServersList({
  servers,
  onViewDossier,
  onSuspend,
  onReactivate,
}: ServersListProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {servers.map((server) => (
        <li key={server.id}>
          <ServerCard
            server={server}
            onViewDossier={onViewDossier}
            onSuspend={onSuspend}
            onReactivate={onReactivate}
          />
        </li>
      ))}
    </ul>
  );
}
