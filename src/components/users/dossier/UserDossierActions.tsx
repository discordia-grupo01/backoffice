import { Button } from "@/components/ui/Button";
import type { PlatformUser } from "@/types/users.types";

interface UserDossierActionsProps {
  user: PlatformUser;
  onSuspend: (user: PlatformUser) => void;
  onReactivate: (user: PlatformUser) => void;
}

export function UserDossierActions({
  user,
  onSuspend,
  onReactivate,
}: UserDossierActionsProps) {
  const isSuspended = user.status === "suspended";

  return (
    <div className="border-line border-t pt-5">
      <Button
        variant={isSuspended ? "success" : "danger"}
        onClick={() => (isSuspended ? onReactivate(user) : onSuspend(user))}
      >
        {isSuspended ? "Reactivar usuario" : "Suspender usuario"}
      </Button>
    </div>
  );
}
