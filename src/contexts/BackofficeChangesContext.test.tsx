import { act, render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  BackofficeChangesProvider,
  useBackofficeChange,
  usePublishBackofficeChange,
} from "./BackofficeChangesContext";

function wrapper({ children }: { children: ReactNode }) {
  return <BackofficeChangesProvider>{children}</BackofficeChangesProvider>;
}

describe("BackofficeChangesContext", () => {
  it("avisa solo a quien escucha ese kind", () => {
    const onRecovery = vi.fn();
    const onUsers = vi.fn();
    const { result } = renderHook(
      () => {
        useBackofficeChange("recovery_requests", onRecovery);
        useBackofficeChange("users", onUsers);
        return usePublishBackofficeChange();
      },
      { wrapper },
    );

    act(() => result.current("recovery_requests"));

    expect(onRecovery).toHaveBeenCalledTimes(1);
    expect(onUsers).not.toHaveBeenCalled();
  });

  it("ignora los kind que nadie escucha, como los que agregue el back más adelante", () => {
    const { result } = renderHook(() => usePublishBackofficeChange(), {
      wrapper,
    });

    expect(() => act(() => result.current("algo_nuevo"))).not.toThrow();
  });

  it("al desmontar deja de avisar", () => {
    const onChange = vi.fn();
    let publish: (kind: string) => void = () => undefined;

    function Publisher() {
      publish = usePublishBackofficeChange();
      return null;
    }
    function Listener() {
      useBackofficeChange("recovery_requests", onChange);
      return null;
    }
    function Screen({ listening }: { listening: boolean }) {
      return (
        <BackofficeChangesProvider>
          <Publisher />
          {listening ? <Listener /> : null}
        </BackofficeChangesProvider>
      );
    }

    const { rerender } = render(<Screen listening />);
    act(() => publish("recovery_requests"));
    expect(onChange).toHaveBeenCalledTimes(1);

    rerender(<Screen listening={false} />);
    act(() => publish("recovery_requests"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
