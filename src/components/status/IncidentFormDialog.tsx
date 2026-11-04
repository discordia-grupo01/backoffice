"use client";

import { X } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { FormAlert } from "@/components/ui/FormAlert";
import { IconButton } from "@/components/ui/IconButton";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import type { IncidentType } from "@/types/status.types";
import {
  INCIDENT_DESCRIPTION_MAX,
  INCIDENT_TITLE_MAX,
  type IncidentDraft,
  type IncidentDraftErrors,
} from "@/utils/incidents";

import { IncidentServicesField } from "./IncidentServicesField";
import { INCIDENT_TYPE_DISPLAY } from "./utils/statusDisplay";

const TYPE_OPTIONS = (["degraded", "maintenance"] as const).map((value) => ({
  value,
  label: INCIDENT_TYPE_DISPLAY[value].label,
}));

interface IncidentFormDialogProps {
  open: boolean;
  draft: IncidentDraft;
  errors: IncidentDraftErrors;
  isSubmitting: boolean;
  error?: string;
  onChange: <K extends keyof IncidentDraft>(
    key: K,
    value: IncidentDraft[K],
  ) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function IncidentFormDialog({
  open,
  draft,
  errors,
  isSubmitting,
  error,
  onChange,
  onSubmit,
  onClose,
}: IncidentFormDialogProps) {
  const titleId = useId();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      className="sm:h-fit sm:max-h-[min(100dvh-3rem,46rem)] sm:w-[min(100vw-3rem,42rem)]"
    >
      <form
        noValidate
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <header className="border-line flex items-start justify-between gap-3 border-b px-5 py-4">
          <div>
            <h2 id={titleId} className="font-display text-lg font-semibold">
              Publicar incidente
            </h2>
            <p className="text-content-subtle mt-0.5 text-xs">
              El aviso será visible inmediatamente para todos los usuarios.
            </p>
          </div>
          <IconButton
            icon={X}
            label="Cerrar"
            showTooltip={false}
            onClick={onClose}
          />
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <TextField
            label="Título"
            hint={`${[...draft.title].length}/${INCIDENT_TITLE_MAX}`}
            value={draft.title}
            maxLength={INCIDENT_TITLE_MAX}
            placeholder="Ej. Demoras en la entrega de mensajes"
            error={errors.title}
            onChange={(event) => onChange("title", event.target.value)}
          />

          <TextAreaField
            label="Descripción"
            hint={`${[...draft.description].length}/${INCIDENT_DESCRIPTION_MAX}`}
            value={draft.description}
            maxLength={INCIDENT_DESCRIPTION_MAX}
            rows={5}
            placeholder="Describí el impacto y qué está haciendo el equipo…"
            error={errors.description}
            onChange={(event) => onChange("description", event.target.value)}
          />

          <fieldset>
            <legend className="text-content-subtle mb-1.5 text-xs font-semibold tracking-wider uppercase">
              Tipo de incidente
            </legend>
            <ToggleGroup<IncidentType>
              label="Tipo de incidente"
              options={TYPE_OPTIONS}
              value={draft.type}
              onChange={(value) => onChange("type", value)}
              className="flex w-full"
            />
          </fieldset>

          <IncidentServicesField
            selected={draft.services}
            error={errors.services}
            onChange={(services) => onChange("services", services)}
          />

          <FormAlert message={error} />
        </div>

        <footer className="border-line bg-surface-sunken flex gap-3 border-t px-5 py-4 sm:justify-end">
          <Button
            variant="secondary"
            className="sm:w-auto sm:px-5"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="sm:w-auto sm:px-5"
            isLoading={isSubmitting}
          >
            Publicar
          </Button>
        </footer>
      </form>
    </Dialog>
  );
}
