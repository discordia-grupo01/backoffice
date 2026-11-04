import type { Metadata } from "next";

import { PlatformStatusView } from "@/components/status/PlatformStatusView";

export const metadata: Metadata = {
  title: "Estado de la plataforma",
};

export default function StatusPage() {
  return <PlatformStatusView />;
}
