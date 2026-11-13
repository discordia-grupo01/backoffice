"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ToastMessage } from "../utils/decisionToast";

const TOAST_DURATION_MS = 3500;

/** El mensaje se conserva al ocultarse, así no desaparece de golpe mientras sale. */
export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const show = useCallback((next: ToastMessage) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(next);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), TOAST_DURATION_MS);
  }, []);

  return { toast, visible, show };
}
