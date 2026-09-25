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

export interface SlideOverProps extends DialogBaseProps {
  side?: "right" | "left";
  /** sm 360 · md 440 · lg 560 · xl 720 */
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "max-w-[360px]",
  md: "max-w-[440px]",
  lg: "max-w-[560px]",
  xl: "max-w-[720px]",
};

/** Panel lateral modal para formularios y detalle (ERP, Backoffice). */
export function SlideOver({
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
  side = "right",
  size = "md",
  className,
  bodyClassName,
  children,
}: SlideOverProps) {
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
            "fixed inset-y-0 z-modal flex w-full flex-col bg-bg text-fg shadow-overlay outline-none",
            side === "right"
              ? "right-0 data-[state=closed]:animate-slide-out-right data-[state=open]:animate-slide-in-right"
              : "left-0 data-[state=closed]:animate-slide-out-left data-[state=open]:animate-slide-in-left",
            "motion-reduce:animate-none",
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
