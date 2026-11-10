"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const SUBJECT_PARAM = "expediente";
const SECTION_PARAM = "seccion";

export function dossierHref(route: string, id: string): string {
  return `${route}?${SUBJECT_PARAM}=${encodeURIComponent(id)}`;
}

export function useDossierUrl<S extends string>(sections: readonly S[]) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const pushes = useRef(0);

  const subjectId = params.get(SUBJECT_PARAM);
  const rawSection = params.get(SECTION_PARAM);
  const section =
    subjectId &&
    rawSection &&
    (sections as readonly string[]).includes(rawSection)
      ? (rawSection as S)
      : null;

  useEffect(() => {
    if (!subjectId) pushes.current = 0;
    else if (!section) pushes.current = Math.min(pushes.current, 1);
  }, [subjectId, section]);

  const urlWith = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null) next.delete(key);
        else next.set(key, value);
      }
      const query = next.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [params, pathname],
  );

  const open = useCallback(
    (id: string) => {
      pushes.current = 1;
      router.push(urlWith({ [SUBJECT_PARAM]: id, [SECTION_PARAM]: null }), {
        scroll: false,
      });
    },
    [router, urlWith],
  );

  const openSection = useCallback(
    (next: S) => {
      pushes.current += 1;
      router.push(urlWith({ [SECTION_PARAM]: next }), { scroll: false });
    },
    [router, urlWith],
  );

  const backToOverview = useCallback(() => {
    if (pushes.current > 1) {
      pushes.current -= 1;
      router.back();
    } else {
      router.replace(urlWith({ [SECTION_PARAM]: null }), { scroll: false });
    }
  }, [router, urlWith]);

  const close = useCallback(() => {
    if (pushes.current > 0) {
      window.history.go(-pushes.current);
      pushes.current = 0;
    } else {
      router.replace(
        urlWith({ [SUBJECT_PARAM]: null, [SECTION_PARAM]: null }),
        {
          scroll: false,
        },
      );
    }
  }, [router, urlWith]);

  return { subjectId, section, open, openSection, backToOverview, close };
}

export type DossierUrl<S extends string> = ReturnType<typeof useDossierUrl<S>>;
