import { CardStat } from "@/components/ui/CardStat";
import { Card } from "@/components/ui/Card";
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

      <dl className="border-line grid grid-cols-2 gap-3 border-t pt-4">
        <CardStat label="Miembros">
          {formatMembers(server.member_count)}
        </CardStat>
        <CardStat label="Creación">{formatDate(server.created_at)}</CardStat>
      </dl>

      <ServerActions server={server} className="mt-auto" {...handlers} />
    </Card>
  );
}
