"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";

export interface SwitchProps extends Omit<ComponentProps<typeof SwitchPrimitive.Root>, "children"> {
  label?: ReactNode;
  description?: ReactNode;
  /** Etiqueta a la izquierda del interruptor. */
  labelPosition?: "start" | "end";
}

/** Interruptor de activación inmediata (ajustes, notificaciones). */
export function Switch({
  label,
  description,
  labelPosition = "end",
  id,
  className,
  ...props
}: SwitchProps) {
  const generated = useId();
  const controlId = id ?? `switch-${generated}`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const control = (
    <SwitchPrimitive.Root
      id={controlId}
      aria-describedby={descriptionId}
      className={cn(
        "relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-full bg-border-strong",
        "transition-[background-color] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent",
        focusRing,
        !label && className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-4 translate-x-[3px] rounded-full bg-bg transition-transform duration-(--doc-dur-state) ease-out data-[state=checked]:translate-x-[21px]" />
    </SwitchPrimitive.Root>
  );
  if (!label) return control;
  return (
    <div
      className={cn(
        "inline-flex items-start gap-3 font-ui text-sm text-fg",
        labelPosition === "start" && "flex-row-reverse justify-between",
        className,
      )}
    >
      {control}
      <span className="grid gap-0.5">
        <label htmlFor={controlId} className="cursor-pointer leading-[22px]">
          {label}
        </label>
        {description ? (
          <span id={descriptionId} className="text-xs text-fg-subtle">
            {description}
          </span>
        ) : null}
      </span>
    </div>
  );
}
