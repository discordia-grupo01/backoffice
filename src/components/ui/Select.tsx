"use client";

import { Check, ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  id?: string;
}

/**
 * Select estilizado para listas cortas -- reemplaza un `<select>` nativo,
 * cuyo popup de opciones no se puede estilizar en ningún browser.
 */
export function Select({ label, value, onChange, options, id }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const selected = options.find((option) => option.value === value);
  const close = () => setIsOpen(false);

  return (
    <div className="relative">
      <label
        htmlFor={selectId}
        className="text-content-subtle mb-1.5 block text-xs font-bold tracking-wider uppercase"
      >
        {label}
      </label>
      <button
        id={selectId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "bg-surface-input border-line text-content flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
          "focus-visible:ring-bo focus-visible:ring-2 focus-visible:outline-none",
          isOpen && "border-bo",
        )}
      >
        <span className={cn("truncate", !selected && "text-content-subtle")}>
          {selected?.label ?? "Seleccionar..."}
        </span>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={cn(
            "text-content-subtle shrink-0 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Cerrar selector"
            onClick={close}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="listbox"
            className="bg-surface-raised border-line-strong absolute top-full left-0 z-50 mt-1.5 w-full overflow-hidden rounded-xl border shadow-2xl"
          >
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      close();
                    }}
                    className="hover:bg-surface-hover flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
                  >
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-sm font-medium",
                        isSelected ? "text-bo" : "text-content",
                      )}
                    >
                      {option.label}
                    </span>
                    {isSelected ? (
                      <Check size={14} className="text-bo shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
