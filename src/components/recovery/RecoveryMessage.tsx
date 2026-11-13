import { cn } from "@/lib/cn";

const NO_MESSAGE = "Sin mensaje";

export function RecoveryMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        message ? "text-content-muted" : "text-content-subtle",
        className,
      )}
      title={message || undefined}
    >
      {message || NO_MESSAGE}
    </p>
  );
}
