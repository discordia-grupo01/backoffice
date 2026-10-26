"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { DossierSection } from "@/types/users.types";

/** Clave propia dentro de `history.state`; Next guarda ahí su estado y no hay que pisarlo. */
const HISTORY_KEY = "userDossier";
const OVERVIEW = "overview";

type DossierView = typeof OVERVIEW | DossierSection;

function currentView(): DossierView | undefined {
  return window.history.state?.[HISTORY_KEY];
}

function pushView(view: DossierView) {
  window.history.pushState(
    { ...window.history.state, [HISTORY_KEY]: view },
    "",
  );
}

/** Cuántos pasos hay que retroceder para salir del expediente desde `view`. */
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
export function useDossierHistory(isOpen: boolean, onClose: () => void) {
  const [section, setSection] = useState<DossierSection | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const isSkippingRef = useRef(false);

  useEffect(() => {
    // `history.go` es asíncrono: sin esta marca, el doble montaje de desarrollo retrocedería dos veces.
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
    // En desarrollo React monta dos veces: si la entrada ya está, no se repite.
    if (currentView() !== OVERVIEW) pushView(OVERVIEW);

    function handlePopState() {
      const view = currentView();
      if (!view) onCloseRef.current();
      else setSection(view === OVERVIEW ? null : view);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen]);

  const openSection = useCallback((next: DossierSection) => {
    pushView(next);
    setSection(next);
  }, []);

  const backToOverview = useCallback(() => window.history.back(), []);

  /** Saca del historial las entradas del expediente; el cierre llega por `popstate`. */
  const close = useCallback(() => {
    const view = currentView();
    if (!view) onCloseRef.current();
    else window.history.go(stepsToLeave(view));
  }, []);

  return { section, openSection, backToOverview, close };
}
