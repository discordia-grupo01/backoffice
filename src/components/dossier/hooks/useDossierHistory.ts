"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HISTORY_KEY = "dossier";
const OVERVIEW = "overview";

type DossierView = string;

function currentView(): DossierView | undefined {
  return window.history.state?.[HISTORY_KEY];
}

function pushView(view: DossierView) {
  window.history.pushState(
    { ...window.history.state, [HISTORY_KEY]: view },
    "",
  );
}

function stepsToLeave(view: DossierView): number {
  return view === OVERVIEW ? -1 : -2;
}

/**
 * Hace que el botón "atrás" del navegador o del celular se mueva dentro del
 * expediente: desde "Ver todos" vuelve al resumen y desde el resumen lo cierra.
 * Cada pantalla del expediente es una entrada del historial, sin cambiar la URL.
 * Si se recarga la página con el expediente abierto, esas entradas quedan
 * huérfanas y se saltean solas, para que "atrás" nunca parezca no hacer nada.
 */
export function useDossierHistory<S extends string>(
  isOpen: boolean,
  onClose: () => void,
) {
  const [section, setSection] = useState<S | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const isSkippingRef = useRef(false);

  useEffect(() => {
    function skipOrphanEntries() {
      const view = currentView();
      if (!view || isOpenRef.current || isSkippingRef.current) return;
      isSkippingRef.current = true;
      window.history.go(stepsToLeave(view));
    }

    function handlePopState() {
      isSkippingRef.current = false;
      skipOrphanEntries();
    }

    skipOrphanEntries();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setSection(null);
    if (currentView() !== OVERVIEW) pushView(OVERVIEW);

    function handlePopState() {
      const view = currentView();
      if (!view) onCloseRef.current();
      else setSection(view === OVERVIEW ? null : (view as S));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen]);

  const openSection = useCallback((next: S) => {
    pushView(next);
    setSection(next);
  }, []);

  const backToOverview = useCallback(() => window.history.back(), []);

  const close = useCallback(() => {
    const view = currentView();
    if (!view) onCloseRef.current();
    else window.history.go(stepsToLeave(view));
  }, []);

  return { section, openSection, backToOverview, close };
}
