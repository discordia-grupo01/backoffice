import { X } from "lucide-react";
import type { ReactNode, Ref } from "react";

import { IconButton } from "@/components/ui/IconButton";

import { DossierBackButton } from "./DossierBackButton";

interface DossierHeaderProps {
  name: string;
  avatar: ReactNode;
  titleId: string;
  onClose: () => void;
  onBack?: () => void;
  backRef?: Ref<HTMLButtonElement>;
}

export function DossierHeader({
  name,
  avatar,
  titleId,
  onClose,
  onBack,
  backRef,
}: DossierHeaderProps) {
  return (
    <header className="border-line flex items-center gap-3 border-b px-5 py-4">
      {onBack ? <DossierBackButton ref={backRef} onClick={onBack} /> : null}
      {avatar}
      <h2
        id={titleId}
        className="font-display min-w-0 flex-1 truncate text-xl leading-tight font-semibold tracking-tight"
      >
        <span className="sr-only">Expediente de </span>
        {name}
      </h2>
      <div className="-mr-1">
        <IconButton
          icon={X}
          label="Cerrar expediente"
          showTooltip={false}
          onClick={onClose}
        />
      </div>
    </header>
  );
}
