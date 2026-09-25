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

/**
 * Devuelve el foco al elemento que lo tenía al abrir. Radix solo lo devuelve a su Trigger; en un
 * diálogo controlado (`open`) sin `trigger`, el foco acababa en <body>.
 */
export function useReturnFocus(hasTrigger: boolean) {
  const previous = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus: () => {
      previous.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    },
    onCloseAutoFocus: (event: Event) => {
      const el = previous.current;
      if (hasTrigger || !el?.isConnected) return;
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
