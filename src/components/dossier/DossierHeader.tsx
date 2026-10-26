import { X } from "lucide-react";
import type { ReactNode } from "react";

import { IconButton } from "@/components/ui/IconButton";

interface DossierHeaderProps {
  name: string;
  avatar: ReactNode;
  titleId: string;
  onClose: () => void;
}

export function DossierHeader({
  name,
  avatar,
  titleId,
  onClose,
}: DossierHeaderProps) {
  return (
    <header className="border-line flex items-center gap-3 border-b px-5 py-4">
      {avatar}
      <h2
        id={titleId}
        className="font-display min-w-0 flex-1 truncate text-xl leading-tight font-semibold tracking-tight"
      >
        <span className="sr-only">Expediente de </span>
        {name}
      </h2>
      <div className="-mr-1">
        <IconButton icon={X} label="Cerrar expediente" onClick={onClose} />
      </div>
    </header>
  );
}
