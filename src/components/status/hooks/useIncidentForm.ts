"use client";

import { useState } from "react";

import { ROUTES } from "@/lib/constants";
import { createIncident } from "@/services/status/client";
import {
  draftToInput,
  hasDraftErrors,
  validateIncidentDraft,
  type IncidentDraft,
} from "@/utils/incidents";

const EMPTY_DRAFT: IncidentDraft = {
  title: "",
  description: "",
  services: [],
  type: "degraded",
};

interface UseIncidentFormOptions {
  onPublished: () => void;
  onForbidden: () => void;
}

export function useIncidentForm({
  onPublished,
  onForbidden,
}: UseIncidentFormOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<IncidentDraft>(EMPTY_DRAFT);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const errors = submitted ? validateIncidentDraft(draft) : {};

  function open() {
    setDraft(EMPTY_DRAFT);
    setSubmitted(false);
    setError(undefined);
    setIsOpen(true);
  }

  function close() {
    if (!isSubmitting) setIsOpen(false);
  }

  function update<K extends keyof IncidentDraft>(
    key: K,
    value: IncidentDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    if (isSubmitting) return;
    setSubmitted(true);
    if (hasDraftErrors(validateIncidentDraft(draft))) return;

    setIsSubmitting(true);
    setError(undefined);
    const result = await createIncident(draftToInput(draft));
    setIsSubmitting(false);

    if (result.ok) {
      setIsOpen(false);
      onPublished();
      return;
    }
    if (result.status === 401) {
      window.location.href = ROUTES.login;
      return;
    }
    if (result.status === 403) {
      setIsOpen(false);
      onForbidden();
      return;
    }
    setError(result.message);
  }

  return {
    isOpen,
    draft,
    errors,
    isSubmitting,
    error,
    open,
    close,
    update,
    submit,
  };
}
