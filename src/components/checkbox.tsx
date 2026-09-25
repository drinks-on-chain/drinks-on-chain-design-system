"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";

export interface CheckboxProps extends Omit<
  ComponentProps<typeof CheckboxPrimitive.Root>,
  "children"
> {
  label?: ReactNode;
  /** Texto secundario bajo la etiqueta. */
  description?: ReactNode;
  invalid?: boolean;
}

/** Casilla de verificación con etiqueta; admite estado "indeterminate". */
export function Checkbox({
  label,
  description,
  invalid,
  id,
  className,
  checked,
  ...props
}: CheckboxProps) {
  const generated = useId();
  const controlId = id ?? `checkbox-${generated}`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const box = (
    <CheckboxPrimitive.Root
      id={controlId}
      checked={checked}
      aria-invalid={invalid || undefined}
      aria-describedby={descriptionId}
      className={cn(
        "mt-0.5 grid size-[18px] shrink-0 cursor-pointer place-items-center rounded-sm border border-border-strong bg-bg-raised text-accent-fg",
        "transition-[background-color,border-color]",
        "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
        "data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
        focusRing,
        !label && className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        {checked === "indeterminate" ? (
          <Minus className="size-3.5" strokeWidth={2.5} aria-hidden />
        ) : (
          <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
  if (!label) return box;
  return (
    <div className={cn("inline-flex items-start gap-2 font-ui text-sm text-fg", className)}>
      {box}
      <span className="grid gap-0.5">
        <label htmlFor={controlId} className="cursor-pointer leading-normal">
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
