"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface TooltipProps extends Omit<
  ComponentProps<typeof TooltipPrimitive.Root>,
  "children"
> {
  /** Texto del tooltip. Complementa, nunca sustituye, al nombre accesible del disparador. */
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** Retardo de apertura en ms. */
  delayDuration?: number;
  className?: string;
  /** Disparador; debe ser un elemento enfocable. */
  children: ReactNode;
}

/** Ayuda breve al pasar o enfocar. */
export function Tooltip({
  content,
  side = "top",
  align = "center",
  delayDuration = 300,
  className,
  children,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root {...props}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            className={cn(
              "z-popover max-w-64 rounded-sm bg-fg px-2 py-1 font-ui text-xs text-bg shadow-overlay",
              "data-[state=closed]:animate-pop-out data-[state=delayed-open]:animate-pop-in data-[state=instant-open]:animate-pop-in motion-reduce:animate-none",
              className,
            )}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
