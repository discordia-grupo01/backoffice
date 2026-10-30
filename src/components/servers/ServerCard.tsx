import { Card } from "@/components/ui/Card";
import { Fact, FactGrid } from "@/components/ui/Fact";
import { cn } from "@/lib/cn";
import { formatDate } from "@/utils/formatDate";
import { formatMembers } from "@/utils/formatNumber";
import type { PlatformServer } from "@/types/servers.types";

import { ServerActions, type ServerActionHandlers } from "./ServerActions";
import { ServerIdentity } from "./ServerIdentity";
import { ServerStatusBadge } from "./ServerStatusBadge";

interface ServerCardProps extends ServerActionHandlers {
  server: PlatformServer;
}

export function ServerCard({ server, ...handlers }: ServerCardProps) {
  return (
    <Card
      as="article"
      className={cn(
        "flex h-full flex-col gap-4 rounded-xl p-5",
        server.suspended_at && "border-danger/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <ServerIdentity server={server} />
        <ServerStatusBadge server={server} />
      </div>

      <FactGrid className="border-line border-t pt-4">
        <Fact label="Miembros" boxed={false}>
          {formatMembers(server.member_count)}
        </Fact>
        <Fact label="Fecha de creación" boxed={false}>
          {formatDate(server.created_at)}
        </Fact>
      </FactGrid>

      <ServerActions server={server} className="mt-auto w-full" {...handlers} />
    </Card>
  );
}
