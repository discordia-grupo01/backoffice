import { ChevronLeft } from "lucide-react";
import { forwardRef } from "react";

export const DossierBackButton = forwardRef<
  HTMLButtonElement,
  { onClick: () => void }
>(function DossierBackButton({ onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label="Volver al expediente"
      className="text-content-subtle hover:bg-surface-hover hover:text-content focus-visible:ring-bo -ml-1 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <ChevronLeft size={20} aria-hidden="true" />
    </button>
  );
});
