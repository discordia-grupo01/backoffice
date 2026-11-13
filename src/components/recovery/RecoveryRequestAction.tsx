import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { RecoveryRequest } from "@/types/recovery.types";
import { requesterName } from "@/utils/recoveryText";

export interface RecoveryRequestActionHandlers {
  onOpen: (request: RecoveryRequest) => void;
}

interface RecoveryRequestActionProps extends RecoveryRequestActionHandlers {
  request: RecoveryRequest;
  className?: string;
}

export function RecoveryRequestAction({
  request,
  onOpen,
  className,
}: RecoveryRequestActionProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={cn("whitespace-nowrap", className)}
      aria-label={`Ver la solicitud de ${requesterName(request)}`}
      onClick={() => onOpen(request)}
    >
      Ver solicitud
    </Button>
  );
}
