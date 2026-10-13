import { getInitial } from "@discordia/client-shared";

import { cn } from "@/lib/cn";

interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function Avatar({ name, size = 36, className }: AvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-bo-gradient font-display text-on-bo flex shrink-0 items-center justify-center rounded-full font-bold select-none",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {getInitial(name) ?? "?"}
    </div>
  );
}
