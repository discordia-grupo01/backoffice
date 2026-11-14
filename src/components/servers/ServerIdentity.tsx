import { Avatar } from "@/components/ui/Avatar";
import { imageSrc } from "@/utils/imageSrc";
import type { PlatformServer } from "@/types/servers.types";

interface ServerIdentityProps {
  server: Pick<PlatformServer, "name" | "icon_url" | "owner_name">;
  /** En la tabla el dueño tiene su propia columna. */
  showOwner?: boolean;
}

export function ServerIdentity({
  server,
  showOwner = true,
}: ServerIdentityProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ServerAvatar name={server.name} iconUrl={server.icon_url} />
      <div className="min-w-0">
        <p className="truncate font-medium" title={server.name}>
          {server.name}
        </p>
        {showOwner ? (
          <p className="text-content-muted truncate text-xs">
            Dueño: {server.owner_name ?? "sin datos"}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Cuadrado redondeado, como los íconos de servidor de la app, para no confundirlo con el avatar de una persona. */
export function ServerAvatar({
  name,
  iconUrl,
}: {
  name: string;
  iconUrl: string | null;
}) {
  return (
    <Avatar
      name={name}
      src={imageSrc(iconUrl)}
      size={40}
      className="rounded-xl"
    />
  );
}
