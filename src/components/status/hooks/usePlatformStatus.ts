"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ROUTES } from "@/lib/constants";
import { getPlatformStatus } from "@/services/status/client";
import type { PlatformStatusResponse } from "@/types/status.types";

export type StatusLoad = "loading" | "success" | "error" | "forbidden";

export function usePlatformStatus() {
  const [load, setLoad] = useState<StatusLoad>("loading");
  const [data, setData] = useState<PlatformStatusResponse | null>(null);
  const requestId = useRef(0);

  const fetchStatus = useCallback(async (showSkeleton: boolean) => {
    const id = ++requestId.current;
    if (showSkeleton) setLoad("loading");

    const result = await getPlatformStatus();
    if (id !== requestId.current) return;

    if (result.ok) {
      setData(result.data);
      setLoad("success");
    } else if (result.status === 401) {
      window.location.href = ROUTES.login;
    } else if (result.status === 403) {
      setLoad("forbidden");
    } else if (showSkeleton) {
      setLoad("error");
    }
  }, []);

  useEffect(() => {
    void fetchStatus(true);
    const requests = requestId;
    return () => {
      requests.current++;
    };
  }, [fetchStatus]);

  const retry = useCallback(() => void fetchStatus(true), [fetchStatus]);
  const refresh = useCallback(() => fetchStatus(false), [fetchStatus]);
  const markForbidden = useCallback(() => setLoad("forbidden"), []);

  return { load, data, retry, refresh, markForbidden };
}
