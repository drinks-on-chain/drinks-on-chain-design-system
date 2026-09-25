"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface PopoverProps extends Omit<
  ComponentProps<typeof PopoverPrimitive.Root>,
  "children"
> {
  /** Disparador (botón). */
  trigger: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  /** Contenido del panel. */
  children: ReactNode;
}

/** Panel flotante no modal anclado a un disparador (filtros, detalles breves). */
export function Popover({
  trigger,
  side = "bottom",
  align = "start",
  className,
  children,
  ...props
}: PopoverProps) {
  return (
    <PopoverPrimitive.Root {...props}>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={side}
          align={align}
          sideOffset={6}
          className={cn(
            "z-dropdown w-72 max-w-[calc(100vw-2rem)] rounded-md border border-border bg-bg p-4 font-ui text-sm text-fg shadow-overlay outline-none",
            "data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in motion-reduce:animate-none",
            className,
          )}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/** Cierra el Popover desde un botón interno. */
export function PopoverClose(props: ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close {...props} />;
}
