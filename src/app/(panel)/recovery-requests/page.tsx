import type { Metadata } from "next";
import { Suspense } from "react";

import { RecoveryRequestsView } from "@/components/recovery/RecoveryRequestsView";

export const metadata: Metadata = {
  title: "Solicitudes de recuperación",
};

export default function RecoveryRequestsPage() {
  return (
    <Suspense>
      <RecoveryRequestsView />
    </Suspense>
  );
}
