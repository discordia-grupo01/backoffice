import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

/** Carga del dashboard: mismas proporciones que el contenido real, para que no salte. */
export function MetricsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando métricas">
      <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {[0, 1, 2].map((item) => (
          <Card key={item} className="skeleton h-[150px] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 min-[1100px]:grid-cols-2">
        {[0, 1, 2].map((item) => (
          <Card
            key={item}
            className={cn(
              "skeleton h-[360px] rounded-[14px]",
              item === 0 && "min-[1100px]:col-span-full",
            )}
          />
        ))}
      </div>
    </div>
  );
}
