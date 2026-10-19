import { Skeleton } from "@/components/ui/Skeleton";
import { PAGE_SIZE } from "@/utils/pagination";

/** Alto aproximado del encabezado y de una fila de `ServersTable`, para que la carga ocupe lo mismo que la tabla. */
const HEADER_HEIGHT_PX = 41;
const ROW_HEIGHT_PX = 65;

export function ServersSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando servidores">
      <Skeleton
        className="w-full rounded-xl"
        style={{ height: HEADER_HEIGHT_PX + PAGE_SIZE * ROW_HEIGHT_PX }}
      />
    </div>
  );
}
