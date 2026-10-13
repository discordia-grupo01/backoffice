import type { Metadata } from "next";

import { MetricsDashboard } from "@/components/metrics/MetricsDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <MetricsDashboard />;
}
