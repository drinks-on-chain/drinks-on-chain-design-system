"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { IconButton } from "./icon-button";

// Piezas compartidas por Modal, SlideOver y BottomSheet (no se exportan desde el índice).

export interface DialogBaseProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Elemento que abre el diálogo (se usa con asChild). */
  trigger?: ReactNode;
  title: ReactNode;
  /** Subtítulo bajo el título; también es la descripción accesible. */
  description?: ReactNode;
  /** Contenido extra en la cabecera, bajo el título (p. ej. un Badge). */
  headerExtra?: ReactNode;
  /** Pie con acciones; alinea a la derecha. */
  footer?: ReactNode;
  closeLabel?: string;
  hideClose?: boolean;
  /** false: no se cierra con Esc ni clic fuera (decisiones obligatorias). */
  dismissible?: boolean;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
}

/** Diálogos abiertos (o que se están cerrando) y el elemento al que devolverán el foco. */
const returnTargets = new WeakMap<Element, { current: HTMLElement | null }>();

const DIALOG_SELECTOR = '[role="dialog"], [role="alertdialog"], dialog[open]';

/** Destino válido para devolver el foco: conectado y distinto de <body>. */
function isFocusTarget(el: HTMLElement | null | undefined): el is HTMLElement {
  return Boolean(el?.isConnected) && el !== document.body;
}

/**
 * Diálogo abierto, distinto de `closing`, que tiene ahora el foco (p. ej. el que abrió la acción
 * elegida en la paleta o confirmada en un ConfirmDialog).
 */
function dialogHoldingFocus(closing: Element | null): Element | null {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement) || active === document.body) return null;
  const holder = active.closest(DIALOG_SELECTOR);
  if (!holder || holder === closing || holder.getAttribute("data-state") === "closed") return null;
  return holder;
}

/**
 * Devuelve el foco al elemento que lo tenía al abrir. Radix solo lo devuelve a su Trigger; en un
 * diálogo controlado (`open`) sin `trigger`, el foco acababa en <body>.
 *
 * Si al cerrarse el foco ya está en otro diálogo abierto después (la acción elegida abrió uno
 * nuevo), no lo toca: el nuevo diálogo hereda el destino de devolución y lo usa al cerrarse.
 */
export function useReturnFocus(hasTrigger: boolean) {
  const previous = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus: (event: Event) => {
      previous.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (event.target instanceof Element) returnTargets.set(event.target, previous);
    },
    onCloseAutoFocus: (event: Event) => {
      const closing = event.target instanceof Element ? event.target : null;
      if (closing) returnTargets.delete(closing);
      const el = previous.current;
      const holder = dialogHoldingFocus(closing);
      if (holder) {
        event.preventDefault();
        const inherited = returnTargets.get(holder);
        if (
          inherited &&
          isFocusTarget(el) &&
          (!isFocusTarget(inherited.current) || closing?.contains(inherited.current))
        ) {
          inherited.current = el;
        }
        return;
      }
      if (hasTrigger || !isFocusTarget(el)) return;
      event.preventDefault();
      el.focus();
    },
  };
}

export function preventWhen(condition: boolean) {
  return condition ? (event: Event) => event.preventDefault() : undefined;
}

export function DialogOverlay() {
  return (
    <DialogPrimitive.Overlay className="fixed inset-0 z-overlay bg-overlay data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in motion-reduce:animate-none" />
  );
}

export function DialogHeader({
  title,
  description,
  headerExtra,
  closeLabel,
  hideClose,
  className,
}: Pick<DialogBaseProps, "title" | "description" | "headerExtra" | "closeLabel" | "hideClose"> & {
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-4",
        className,
      )}
    >
      <div className="grid min-w-0 gap-1">
        <DialogPrimitive.Title className="m-0 font-display text-xl leading-tight font-medium text-fg">
          {title}
        </DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="m-0 font-ui text-xs text-fg-subtle">
            {description}
          </DialogPrimitive.Description>
        ) : null}
        {headerExtra}
      </div>
      {hideClose ? null : (
        <DialogPrimitive.Close asChild>
          <IconButton label={closeLabel ?? "Cerrar"} size="sm" className="-mr-2">
            <X aria-hidden />
          </IconButton>
        </DialogPrimitive.Close>
      )}
    </header>
  );
}

export function DialogBody({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-auto p-6 font-ui", className)}>{children}</div>
  );
}

export function DialogFooter({ children }: { children?: ReactNode }) {
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-bg-raised px-6 py-4">
      {children}
    </footer>
  );
}
