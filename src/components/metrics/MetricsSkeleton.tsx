import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

/** Carga del dashboard: mismas proporciones que el contenido real, para que no salte. */
export function MetricsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando métricas">
      <div className="mb-5 grid grid-cols-1 gap-4 @3xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-[150px] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
        {[0, 1, 2].map((item) => (
          <Skeleton
            key={item}
            className={cn(
              "h-[360px] rounded-[14px]",
              item === 0 && "@3xl:col-span-full",
            )}
          />
        ))}
      </div>
    </div>
  );
}
