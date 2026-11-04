import { cn } from "@/lib/cn";
import type { PlatformServiceId } from "@/types/status.types";
import { PLATFORM_SERVICES } from "@/utils/incidents";

interface IncidentServicesFieldProps {
  selected: PlatformServiceId[];
  error?: string;
  onChange: (services: PlatformServiceId[]) => void;
}

export function IncidentServicesField({
  selected,
  error,
  onChange,
}: IncidentServicesFieldProps) {
  function toggle(id: PlatformServiceId) {
    onChange(
      selected.includes(id)
        ? selected.filter((service) => service !== id)
        : [...selected, id],
    );
  }

  return (
    <fieldset aria-describedby={error ? "incident-services-error" : undefined}>
      <legend className="text-content-subtle mb-1.5 text-xs font-semibold tracking-wider uppercase">
        Servicios afectados <span className="text-danger">*</span>
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {PLATFORM_SERVICES.map((service) => {
          const checked = selected.includes(service.id);
          return (
            <label
              key={service.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                checked
                  ? "border-bo bg-bo/10 text-content"
                  : error
                    ? "border-danger bg-surface-input text-content-muted"
                    : "border-line bg-surface-input text-content-muted hover:border-line-strong",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(service.id)}
                className="accent-bo size-4 shrink-0"
              />
              {service.label}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id="incident-services-error" className="text-danger mt-1.5 text-xs">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
