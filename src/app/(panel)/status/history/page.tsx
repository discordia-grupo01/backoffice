import type { Metadata } from "next";

import { IncidentHistoryView } from "@/components/status/history/IncidentHistoryView";

export const metadata: Metadata = {
  title: "Historial de incidentes",
};

export default function IncidentHistoryPage() {
  return <IncidentHistoryView />;
}
