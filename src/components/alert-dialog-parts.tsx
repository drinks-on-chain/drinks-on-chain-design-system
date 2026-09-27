"use client";

import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { TriangleAlert } from "lucide-react";
import { useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { useReturnFocus } from "./dialog-parts";

// Piezas compartidas por ConfirmDialog y ReasonDialog (no se exportan desde el índice).
// Usan AlertDialog de Radix: role="alertdialog", no se cierran con un clic fuera y el foco
// queda atrapado; Esc cancela salvo mientras la acción está en curso.

export interface ConfirmBaseProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Elemento que abre el diálogo (se usa con asChild). */
  trigger?: ReactNode;
  title: ReactNode;
  /** Explicación de la consecuencia; también es la descripción accesible. */
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Acción destructiva o sobre terceros: botón rojo e icono de aviso. */
  destructive?: boolean;
  /** Texto si `onConfirm` falla sin mensaje propio. */
  errorLabel?: string;
  className?: string;
  children?: ReactNode;
}

/** Estado abierto controlado o no, con la acción asíncrona y su error. */
export function useConfirmState({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  errorLabel = "No se pudo completar la acción. Inténtalo de nuevo.",
}: Pick<ConfirmBaseProps, "open" | "defaultOpen" | "onOpenChange" | "errorLabel">) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next);
    if (!next) setError(null);
    onOpenChange?.(next);
  };

  /** Ejecuta la acción; cierra si termina bien y muestra el error si falla. */
  const run = async (action: () => void | Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      setOpen(false);
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : errorLabel);
    } finally {
      setBusy(false);
    }
  };

  return { open, setOpen, busy, error, run };
}

interface ConfirmFrameProps extends Omit<
  ConfirmBaseProps,
  "open" | "defaultOpen" | "onOpenChange" | "errorLabel"
> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  error: string | null;
  onSubmit: () => void;
  confirmDisabled?: boolean;
  /** Elemento que recibe el foco al abrir (por defecto el botón Cancelar). */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export function ConfirmFrame({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  busy,
  error,
  onSubmit,
  confirmDisabled = false,
  initialFocusRef,
  className,
  children,
}: ConfirmFrameProps) {
  const returnFocus = useReturnFocus(Boolean(trigger));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!busy) onSubmit();
  };
  return (
    <AlertDialogPrimitive.Root
      open={open}
      onOpenChange={(next) => (busy ? undefined : onOpenChange(next))}
    >
      {trigger ? (
        <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>
      ) : null}
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-overlay bg-overlay data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in motion-reduce:animate-none" />
        <AlertDialogPrimitive.Content
          {...(description ? {} : { "aria-describedby": undefined })}
          onOpenAutoFocus={(event) => {
            returnFocus.onOpenAutoFocus();
            if (initialFocusRef?.current) {
              event.preventDefault();
              initialFocusRef.current.focus();
            }
          }}
          onCloseAutoFocus={returnFocus.onCloseAutoFocus}
          onEscapeKeyDown={(event) => {
            if (busy) event.preventDefault();
          }}
          className={cn(
            "fixed top-1/2 left-1/2 z-modal flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col",
            "overflow-hidden rounded-lg bg-bg font-ui text-fg shadow-overlay outline-none",
            "data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in motion-reduce:animate-none",
            className,
          )}
        >
          <form onSubmit={submit} className="flex min-h-0 flex-col" noValidate>
            <div className="flex min-h-0 gap-4 overflow-auto px-6 pt-6 pb-5">
              {destructive ? (
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-danger-soft text-danger-text"
                >
                  <TriangleAlert className="size-5 stroke-[1.5]" />
                </span>
              ) : null}
              <div className="grid min-w-0 flex-1 content-start gap-2">
                <AlertDialogPrimitive.Title className="m-0 font-display text-xl leading-tight font-medium text-fg">
                  {title}
                </AlertDialogPrimitive.Title>
                {description ? (
                  <AlertDialogPrimitive.Description className="m-0 text-sm text-fg-muted">
                    {description}
                  </AlertDialogPrimitive.Description>
                ) : null}
                {children ? <div className="mt-2 grid gap-3 text-sm">{children}</div> : null}
                {error ? (
                  <p role="alert" className="m-0 mt-1 text-sm text-danger-text">
                    {error}
                  </p>
                ) : null}
              </div>
            </div>
            <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-bg-raised px-6 py-4">
              <AlertDialogPrimitive.Cancel asChild>
                <Button variant="secondary" disabled={busy}>
                  {cancelLabel}
                </Button>
              </AlertDialogPrimitive.Cancel>
              <Button
                type="submit"
                variant={destructive ? "destructive" : "primary"}
                loading={busy}
                disabled={confirmDisabled}
              >
                {confirmLabel}
              </Button>
            </footer>
          </form>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
