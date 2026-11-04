"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getServiceHealth } from "@/services/status/healthClient";
import { getPlatformStatus } from "@/services/status/client";
import type {
  PlatformStatusResponse,
  ServiceHealthState,
} from "@/types/status.types";

interface PlatformStatusContextValue {
  platform: PlatformStatusResponse | null;
  setPlatform: (platform: PlatformStatusResponse) => void;
  health: ServiceHealthState;
}

const PlatformStatusContext = createContext<PlatformStatusContextValue | null>(
  null,
);

export function PlatformStatusProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatform] = useState<PlatformStatusResponse | null>(null);
  const [health, setHealth] = useState<ServiceHealthState>({
    phase: "loading",
  });

  useEffect(() => {
    let cancelled = false;
    getPlatformStatus().then((result) => {
      if (!cancelled && result.ok) setPlatform(result.data);
    });
    getServiceHealth().then((result) => {
      if (cancelled) return;
      setHealth(
        result.ok
          ? { phase: "ready", checks: result.checks }
          : { phase: "error", message: result.message },
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ platform, setPlatform, health }),
    [platform, health],
  );

  return (
    <PlatformStatusContext.Provider value={value}>
      {children}
    </PlatformStatusContext.Provider>
  );
}

export function usePlatformStatusContext(): PlatformStatusContextValue {
  const value = useContext(PlatformStatusContext);
  if (!value)
    throw new Error("usePlatformStatusContext fuera de PlatformStatusProvider");
  return value;
}
