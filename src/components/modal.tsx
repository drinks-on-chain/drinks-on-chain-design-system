"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";
import {
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  preventWhen,
  useReturnFocus,
  type DialogBaseProps,
} from "./dialog-parts";

export interface ModalProps extends DialogBaseProps {
  /** sm 400 · md 560 · lg 720 · xl 960 · wide 80 % de la pantalla (revisión de emisión). */
  size?: "sm" | "md" | "lg" | "xl" | "wide";
}

const sizes = {
  sm: "max-w-[400px]",
  md: "max-w-[560px]",
  lg: "max-w-[720px]",
  xl: "max-w-[960px]",
  wide: "max-w-[min(1200px,80vw)]",
};

/**
 * Diálogo modal (Radix Dialog): foco atrapado, Esc cierra, el foco vuelve al disparador.
 * Un solo nivel de modal por pantalla.
 */
export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  headerExtra,
  footer,
  closeLabel = "Cerrar",
  hideClose = false,
  dismissible = true,
  size = "md",
  className,
  bodyClassName,
  children,
}: ModalProps) {
  const returnFocus = useReturnFocus(Boolean(trigger));
  return (
    <DialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          {...(description ? {} : { "aria-describedby": undefined })}
          onEscapeKeyDown={preventWhen(!dismissible)}
          onPointerDownOutside={preventWhen(!dismissible)}
          onInteractOutside={preventWhen(!dismissible)}
          {...returnFocus}
          className={cn(
            "fixed top-1/2 left-1/2 z-modal flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col",
            "overflow-hidden rounded-lg bg-bg text-fg shadow-overlay outline-none",
            "data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in motion-reduce:animate-none",
            sizes[size],
            className,
          )}
        >
          <DialogHeader
            title={title}
            description={description}
            headerExtra={headerExtra}
            closeLabel={closeLabel}
            hideClose={hideClose || !dismissible}
          />
          <DialogBody className={bodyClassName}>{children}</DialogBody>
          {footer ? <DialogFooter>{footer}</DialogFooter> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Envuelve un botón del pie para que cierre el diálogo: `<ModalClose asChild><Button/></ModalClose>`. */
export function ModalClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}
