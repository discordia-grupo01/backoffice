import { CardGrid } from "@/components/ui/CardGrid";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import type { ViewMode } from "@/hooks/useViewMode";
import type { RecoveryRequest } from "@/types/recovery.types";

import type { RecoveryRequestActionHandlers } from "./RecoveryRequestAction";
import { RecoveryRequestCard } from "./RecoveryRequestCard";
import { RecoveryRequestsTable } from "./RecoveryRequestsTable";

interface RecoveryRequestsListProps extends RecoveryRequestActionHandlers {
  requests: readonly RecoveryRequest[];
  view: ViewMode;
}

export function RecoveryRequestsList({
  requests,
  view,
  ...handlers
}: RecoveryRequestsListProps) {
  return (
    <ViewSwitch
      view={view}
      table={<RecoveryRequestsTable requests={requests} {...handlers} />}
      cards={
        <CardGrid>
          {requests.map((request) => (
            <li key={request.id}>
              <RecoveryRequestCard request={request} {...handlers} />
            </li>
          ))}
        </CardGrid>
      }
    />
  );
}
