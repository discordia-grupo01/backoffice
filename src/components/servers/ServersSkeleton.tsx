import { Skeleton } from "@/components/ui/Skeleton";

import { SERVERS_PAGE_SIZE } from "./hooks/useServers";

/** Misma grilla que `ServersList`, así la carga no cambia el alto ni el ancho de las tarjetas. */
export function ServersSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando servidores"
      className="grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3"
    >
      {Array.from({ length: SERVERS_PAGE_SIZE }, (_, index) => (
        <Skeleton key={index} className="h-[176px] w-full rounded-xl" />
      ))}
    </div>
  );
}
