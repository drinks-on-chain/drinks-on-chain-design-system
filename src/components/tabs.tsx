"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";

/** Pestañas (Radix Tabs): Tabs › TabsList › TabsTrigger + TabsContent. Flechas para moverse. */
export function Tabs({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("grid gap-4", className)} {...props} />;
}

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "flex [scrollbar-width:none] gap-6 overflow-x-auto border-b border-border font-ui",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "-mb-px inline-flex shrink-0 cursor-pointer items-center gap-2 border-b-2 border-transparent bg-transparent py-3 text-sm leading-none font-medium whitespace-nowrap text-fg-subtle",
        "transition-[color,border-color] hover:text-fg",
        "data-[state=active]:border-accent data-[state=active]:text-fg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("rounded-sm", focusRing, className)} {...props} />;
}
