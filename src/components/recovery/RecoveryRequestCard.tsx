import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import type { RecoveryRequest } from "@/types/recovery.types";
import { formatDateTime } from "@/utils/formatDate";
import { imageSrc } from "@/utils/imageSrc";
import { requesterName } from "@/utils/recoveryText";

import {
  RecoveryRequestAction,
  type RecoveryRequestActionHandlers,
} from "./RecoveryRequestAction";
import { RecoveryMessage } from "./RecoveryMessage";
import { RecoveryStatusBadge } from "./RecoveryStatusBadge";

interface RecoveryRequestCardProps extends RecoveryRequestActionHandlers {
  request: RecoveryRequest;
}

export function RecoveryRequestCard({
  request,
  ...handlers
}: RecoveryRequestCardProps) {
  const name = requesterName(request);

  return (
    <Card as="article" className="flex h-full flex-col gap-4 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            name={name}
            src={imageSrc(request.user?.avatar_url)}
            size={40}
          />
          <div className="min-w-0">
            <p className="truncate font-medium" title={name}>
              {name}
            </p>
            {request.user ? (
              <p
                className="text-content-muted truncate font-mono text-xs"
                title={request.user.email}
              >
                {request.user.email}
              </p>
            ) : null}
          </div>
        </div>
        <RecoveryStatusBadge status={request.status} />
      </div>

      <div className="border-line bg-surface-input flex-1 rounded-xl border px-4 py-3">
        <time
          dateTime={request.requested_at}
          className="text-content-muted block font-mono text-xs tabular-nums"
        >
          Enviada el {formatDateTime(request.requested_at)}
        </time>
        <RecoveryMessage
          message={request.message}
          className="mt-2 line-clamp-3 min-h-[3lh] text-sm leading-relaxed"
        />
      </div>

      <RecoveryRequestAction
        request={request}
        className="mt-auto w-full"
        {...handlers}
      />
    </Card>
  );
}
