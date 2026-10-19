import type { Metadata } from "next";

import { ServersView } from "@/components/servers/ServersView";

export const metadata: Metadata = {
  title: "Servidores",
};

export default function ServersPage() {
  return <ServersView />;
}
