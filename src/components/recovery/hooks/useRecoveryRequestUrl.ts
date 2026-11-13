"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { RECOVERY_REQUEST_PARAM } from "@/utils/recoveryRequestHref";

export function useRecoveryRequestUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const requestId = params.get(RECOVERY_REQUEST_PARAM);

  const navigate = useCallback(
    (id: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (id) next.set(RECOVERY_REQUEST_PARAM, id);
      else next.delete(RECOVERY_REQUEST_PARAM);
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [params, pathname, router],
  );

  return {
    requestId,
    open: useCallback((id: string) => navigate(id), [navigate]),
    close: useCallback(() => navigate(null), [navigate]),
  };
}
