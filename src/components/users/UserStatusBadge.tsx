import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { UserStatus } from "@/types/users.types";

const STATUS_BADGE: Record<UserStatus, { label: string; tone: BadgeTone }> = {
  active: { label: "Activo", tone: "success" },
  pending: { label: "Pendiente", tone: "neutral" },
  suspended: { label: "Suspendido", tone: "danger" },
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const { label, tone } = STATUS_BADGE[status];
  return <Badge tone={tone}>{label}</Badge>;
}
