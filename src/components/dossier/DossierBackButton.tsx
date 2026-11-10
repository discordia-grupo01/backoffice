import { ArrowLeft } from "lucide-react";
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
      className="text-content-muted hover:text-content focus-visible:ring-bo -ml-1 flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Volver al expediente
    </button>
  );
});
