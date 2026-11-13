"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { usePublishBackofficeChange } from "@/contexts/BackofficeChangesContext";
import { api } from "@/lib/browserApiClient";
import { getPlatformStatus } from "@/services/status/client";
import { getServiceHealth } from "@/services/status/healthClient";
import { connectHealthNotifications } from "@/services/notifications/socket";
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
  const publishChange = usePublishBackofficeChange();

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      void getPlatformStatus().then((result) => {
        if (!cancelled && result.ok) setPlatform(result.data);
      });
      void getServiceHealth().then((result) => {
        if (cancelled) return;
        if (result.ok) {
          setHealth({ phase: "ready", checks: result.checks });
        } else {
          setHealth({
            phase: result.status === 403 ? "forbidden" : "error",
            message: result.message,
          });
        }
      });
    };

    refresh();
    let disconnect: (() => void) | undefined;
    void api
      .get<{ ok: boolean; userId?: string }>("/auth/session")
      .then(async ({ data }) => {
        if (cancelled || !data.ok || !data.userId) return;
        const close = await connectHealthNotifications(
          data.userId,
          refresh,
          refresh,
          publishChange,
        );
        if (cancelled) close();
        else disconnect = close;
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      disconnect?.();
    };
  }, [publishChange]);

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
