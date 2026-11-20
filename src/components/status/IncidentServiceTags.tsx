import { serviceLabel } from "@/utils/incidents";

export function IncidentServiceTags({ services }: { services: string[] }) {
  return (
    <>
      {services.map((service) => (
        <span
          key={service}
          className="bg-surface-input text-content-muted rounded-md px-2 py-1 text-xs"
        >
          {serviceLabel(service)}
        </span>
      ))}
    </>
  );
}
