"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
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

export interface BottomSheetProps extends DialogBaseProps {
  /** Alto máximo como fracción de la pantalla. */
  maxHeight?: "half" | "tall" | "full";
}

const heights = { half: "max-h-[55dvh]", tall: "max-h-[85dvh]", full: "max-h-[100dvh]" };

/**
 * Hoja inferior modal (Marketplace en móvil): checkout, detalle de activo, selector de punto.
 * En pantallas anchas queda centrada con un ancho máximo de 560 px.
 */
export function BottomSheet({
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
  maxHeight = "tall",
  className,
  bodyClassName,
  children,
}: BottomSheetProps) {
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
            "fixed inset-x-0 bottom-0 z-modal mx-auto flex w-full max-w-[560px] flex-col rounded-t-lg bg-bg pb-[env(safe-area-inset-bottom)] text-fg shadow-overlay outline-none",
            "before:absolute before:top-2 before:left-1/2 before:h-1 before:w-10 before:-translate-x-1/2 before:rounded-sm before:bg-border-strong before:content-['']",
            "data-[state=closed]:animate-slide-out-bottom data-[state=open]:animate-slide-in-bottom motion-reduce:animate-none",
            heights[maxHeight],
            className,
          )}
        >
          <DialogHeader
            className="pt-6"
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
