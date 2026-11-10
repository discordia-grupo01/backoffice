import type { Metadata } from "next";
import { Suspense } from "react";

import { ServersView } from "@/components/servers/ServersView";

export const metadata: Metadata = {
  title: "Servidores",
};

export default function ServersPage() {
  return (
    <Suspense>
      <ServersView />
    </Suspense>
  );
}
