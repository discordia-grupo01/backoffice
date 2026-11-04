import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { StateBox } from "@/components/ui/StateBox";

export function StatusSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Cargando estado">
      <Skeleton className="h-[112px] rounded-[14px]" />
      <Skeleton className="h-[320px] rounded-[14px]" />
    </div>
  );
}

export function StatusErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StateBox
      role="alert"
      icon={AlertTriangle}
      title="No se pudo cargar el estado"
      action={
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={onRetry}
        >
          Reintentar
        </Button>
      }
    >
      Revisá tu conexión e intentá de nuevo.
    </StateBox>
  );
}
