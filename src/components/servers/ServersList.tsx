import { CardGrid } from "@/components/ui/CardGrid";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import type { ViewMode } from "@/hooks/useViewMode";
import type { PlatformServer } from "@/types/servers.types";

import { ServerCard } from "./ServerCard";
import type { ServerActionHandlers } from "./ServerActions";
import { ServersTable } from "./ServersTable";

interface ServersListProps extends ServerActionHandlers {
  servers: readonly PlatformServer[];
  view: ViewMode;
}

export function ServersList({ servers, view, ...handlers }: ServersListProps) {
  return (
    <ViewSwitch
      view={view}
      table={<ServersTable servers={servers} {...handlers} />}
      cards={
        <CardGrid>
          {servers.map((server) => (
            <li key={server.id}>
              <ServerCard server={server} {...handlers} />
            </li>
          ))}
        </CardGrid>
      }
    />
  );
}
