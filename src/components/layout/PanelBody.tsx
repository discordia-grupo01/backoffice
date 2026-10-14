import type { ReactNode } from "react";

/**
 * Contenedor del contenido de cada sección del panel: ancho máximo y márgenes.
 * Es un `@container`, así que sus hijos se adaptan al espacio que queda junto
 * al menú lateral y no al ancho de la ventana.
 */
export function PanelBody({ children }: { children: ReactNode }) {
  return (
    <div className="@container mx-auto max-w-[1400px] px-3 pt-4 pb-6 min-[481px]:px-4 min-[481px]:pt-5 min-[481px]:pb-8 md:px-6 md:pt-6 md:pb-10">
      {children}
    </div>
  );
}
