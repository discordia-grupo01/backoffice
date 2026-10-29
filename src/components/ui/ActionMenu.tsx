"use client";

import { MoreVertical } from "lucide-react";
import {
  Fragment,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { cn } from "@/lib/cn";

export type ActionTone = "caution" | "positive" | "danger";

export interface ActionMenuItem {
  label: string;
  tone: ActionTone;
  onSelect: () => void;
  separated?: boolean;
}

const TONES: Record<ActionTone, string> = {
  caution: "text-warning-readable",
  positive: "text-success-readable",
  danger: "text-danger-readable",
};

const GAP_PX = 4;

interface ActionMenuProps {
  label: string;
  items: readonly ActionMenuItem[];
}

export function ActionMenu({ label, items }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  function close({ restoreFocus }: { restoreFocus: boolean }) {
    setIsOpen(false);
    setPosition(null);
    if (restoreFocus) buttonRef.current?.focus();
  }

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!isOpen || !button || !menu) return;

    const rect = button.getBoundingClientRect();
    const fitsBelow =
      rect.bottom + GAP_PX + menu.offsetHeight <= window.innerHeight;
    setPosition({
      top: fitsBelow
        ? rect.bottom + GAP_PX
        : rect.top - GAP_PX - menu.offsetHeight,
      right: window.innerWidth - rect.right,
    });
  }, [isOpen]);

  useEffect(() => {
    if (position) firstItem(menuRef.current)?.focus();
  }, [position]);

  useEffect(() => {
    if (!isOpen) return;

    function dismiss() {
      setIsOpen(false);
      setPosition(null);
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      )
        return;
      dismiss();
    }

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [isOpen]);

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    const index = menuItems.indexOf(document.activeElement as HTMLElement);
    const focusAt = (next: number) =>
      menuItems[(next + menuItems.length) % menuItems.length]?.focus();

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusAt(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(-1);
        break;
      case "Escape":
        event.preventDefault();
        close({ restoreFocus: true });
        break;
      case "Tab":
        close({ restoreFocus: false });
        break;
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors",
          "focus-visible:ring-bo focus-visible:ring-2 focus-visible:outline-none",
          isOpen
            ? "bg-surface-hover text-content"
            : "text-content-subtle hover:bg-surface-hover hover:text-content",
        )}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() =>
          isOpen ? close({ restoreFocus: false }) : setIsOpen(true)
        }
      >
        <MoreVertical size={18} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          style={
            position
              ? { top: position.top, right: position.right }
              : { visibility: "hidden" }
          }
          className="bg-surface-raised border-line fixed z-50 min-w-44 rounded-xl border p-1 shadow-lg"
        >
          {items.map((item) => (
            <Fragment key={item.label}>
              {item.separated ? (
                <div role="separator" className="border-line my-1 border-t" />
              ) : null}
              <button
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  close({ restoreFocus: true });
                  item.onSelect();
                }}
                className={cn(
                  "w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium outline-none",
                  "hover:bg-surface-hover focus-visible:bg-surface-hover",
                  TONES[item.tone],
                )}
              >
                {item.label}
              </button>
            </Fragment>
          ))}
        </div>
      ) : null}
    </>
  );
}

function firstItem(menu: HTMLElement | null) {
  return menu?.querySelector<HTMLElement>('[role="menuitem"]') ?? null;
}
