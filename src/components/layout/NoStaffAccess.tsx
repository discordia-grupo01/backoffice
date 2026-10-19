import { ShieldOff } from "lucide-react";

import { StateBox } from "@/components/ui/StateBox";

/** Pantalla completa para quien no tiene rol de staff: reemplaza a toda la sección. */
export function NoStaffAccess() {
  return (
    <StateBox
      role="alert"
      isFullScreen
      headingLevel="h1"
      icon={ShieldOff}
      title="No tenés permisos para ver esta sección"
    >
      Esta sección es solo para el staff de Discordia. Si creés que es un error,
      contactá a un administrador.
    </StateBox>
  );
}
