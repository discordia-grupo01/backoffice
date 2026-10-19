import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatDate } from "@/utils/formatDate";
import { formatMembers } from "@/utils/formatNumber";
import type { PlatformServer } from "@/types/servers.types";

import { ServerIdentity } from "./ServerIdentity";

interface ServerCardProps {
  server: PlatformServer;
  onViewDossier: (server: PlatformServer) => void;
  onSuspend: (server: PlatformServer) => void;
  onReactivate: (server: PlatformServer) => void;
}

export function ServerCard({
  server,
  onViewDossier,
  onSuspend,
  onReactivate,
}: ServerCardProps) {
  const isSuspended = Boolean(server.suspended_at);

  return (
    <Card
      as="article"
      className={cn(
        "flex h-full flex-col gap-4 rounded-xl p-5",
        isSuspended && "border-danger/40",
      )}
    >
      <ServerIdentity server={server} />

      <dl className="border-line grid grid-cols-2 gap-3 border-t pt-4">
        <Stat label="Miembros" value={formatMembers(server.member_count)} />
        <Stat label="Creación" value={formatDate(server.created_at)} />
      </dl>

      <div className="mt-auto flex gap-2">
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
            variant="secondary"
            size="sm"
            className="bg-success/15 text-success hover:border-success flex-1 border-transparent"
            aria-label={`Reactivar ${server.name}`}
            onClick={() => onReactivate(server)}
          >
            Reactivar
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="bg-warning/15 text-warning hover:border-warning flex-1 border-transparent"
            aria-label={`Suspender ${server.name}`}
            onClick={() => onSuspend(server)}
          >
            Suspender
          </Button>
        )}
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-content-muted mt-0.5 text-xs">{label}</dt>
      <dd className="font-mono text-base font-bold tabular-nums">{value}</dd>
    </div>
  );
}
