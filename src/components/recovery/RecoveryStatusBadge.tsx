import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { RecoveryRequestStatus } from "@/types/recovery.types";

const STATUS_BADGE: Record<
  RecoveryRequestStatus,
  { label: string; tone: BadgeTone }
> = {
  pending: { label: "Pendiente", tone: "warning" },
  approved: { label: "Aprobada", tone: "success" },
  rejected: { label: "Rechazada", tone: "danger" },
};

export function RecoveryStatusBadge({
  status,
}: {
  status: RecoveryRequestStatus;
}) {
  const { label, tone } = STATUS_BADGE[status];
  return <Badge tone={tone}>{label}</Badge>;
}
