"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

export type BackofficeChangeKind =
  | "users"
  | "servers"
  | "reports"
  | "staff"
  | "dossier"
  | "metrics"
  | "recovery_requests";

type Listener = () => void;

interface BackofficeChangesValue {
  subscribe: (kind: BackofficeChangeKind, listener: Listener) => () => void;
  publish: (kind: string) => void;
}

const BackofficeChangesContext = createContext<BackofficeChangesValue | null>(
  null,
);

/**
 * Reparte los avisos de "algo cambió" que llegan por el socket del panel a las
 * pantallas que los escuchan. También se publica desde el propio navegador
 * después de una acción, para no depender de que el aviso vuelva por el socket.
 */
export function BackofficeChangesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const listeners = useRef(new Map<string, Set<Listener>>());

  const value = useMemo<BackofficeChangesValue>(
    () => ({
      subscribe: (kind, listener) => {
        const current = listeners.current.get(kind) ?? new Set<Listener>();
        current.add(listener);
        listeners.current.set(kind, current);
        return () => {
          current.delete(listener);
        };
      },
      publish: (kind) => {
        listeners.current.get(kind)?.forEach((listener) => listener());
      },
    }),
    [],
  );

  return (
    <BackofficeChangesContext.Provider value={value}>
      {children}
    </BackofficeChangesContext.Provider>
  );
}

function useBackofficeChangesContext(): BackofficeChangesValue {
  const value = useContext(BackofficeChangesContext);
  if (!value) {
    throw new Error("useBackofficeChanges fuera de BackofficeChangesProvider");
  }
  return value;
}

export function useBackofficeChange(
  kind: BackofficeChangeKind,
  onChange: () => void,
): void {
  const { subscribe } = useBackofficeChangesContext();
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(
    () => subscribe(kind, () => onChangeRef.current()),
    [subscribe, kind],
  );
}

export function usePublishBackofficeChange(): BackofficeChangesValue["publish"] {
  return useBackofficeChangesContext().publish;
}
