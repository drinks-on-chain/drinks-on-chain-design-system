"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import { useFieldContext } from "./field";

type RadioVariant = "default" | "card";
const VariantContext = createContext<RadioVariant>("default");

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends ComponentProps<typeof RadioGroupPrimitive.Root> {
  options?: RadioOption[];
  /** "card": cada opción es una tarjeta seleccionable (método de pago, destino de lote). */
  variant?: RadioVariant;
  invalid?: boolean;
}

/** Grupo de opciones exclusivas. Dentro de un Field toma su etiqueta y descripción. */
export function RadioGroup({
  options,
  variant = "default",
  invalid,
  orientation = "vertical",
  className,
  children,
  ...props
}: RadioGroupProps) {
  const field = useFieldContext();
  return (
    <VariantContext.Provider value={variant}>
      <RadioGroupPrimitive.Root
        orientation={orientation}
        aria-labelledby={props["aria-label"] ? undefined : field?.labelId}
        aria-describedby={field?.describedBy}
        aria-invalid={invalid || field?.invalid || undefined}
        required={props.required ?? field?.required}
        disabled={props.disabled ?? field?.disabled}
        className={cn(
          "flex gap-3",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          variant === "card" && "gap-2.5",
          className,
        )}
        {...props}
      >
        {options?.map((option) => (
          <RadioGroupItem
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
          />
        ))}
        {children}
      </RadioGroupPrimitive.Root>
    </VariantContext.Provider>
  );
}

export interface RadioGroupItemProps extends Omit<
  ComponentProps<typeof RadioGroupPrimitive.Item>,
  "children"
> {
  label: ReactNode;
  description?: ReactNode;
}

/** Opción de RadioGroup. */
export function RadioGroupItem({
  label,
  description,
  id,
  className,
  ...props
}: RadioGroupItemProps) {
  const variant = useContext(VariantContext);
  const generated = useId();
  const itemId = id ?? `radio-${generated}`;
  const descriptionId = description ? `${itemId}-description` : undefined;

  const dot = (
    <RadioGroupPrimitive.Item
      id={itemId}
      aria-describedby={descriptionId}
      className={cn(
        "peer mt-0.5 grid size-[18px] shrink-0 cursor-pointer place-items-center rounded-full border border-border-strong bg-bg-raised",
        "transition-[border-color] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-accent",
        focusRing,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-accent" />
    </RadioGroupPrimitive.Item>
  );

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 font-ui text-sm text-fg",
        variant === "card" &&
          "rounded-md border border-border bg-bg-raised px-3.5 py-3 transition-[border-color,box-shadow] has-[[data-state=checked]]:border-accent has-[[data-state=checked]]:shadow-[inset_0_0_0_1px_var(--doc-accent)]",
        className,
      )}
    >
      {dot}
      <span className="grid gap-0.5">
        <label
          htmlFor={itemId}
          className={cn(
            "cursor-pointer leading-normal",
            variant === "card" && "font-medium after:absolute after:inset-0 after:content-['']",
          )}
        >
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
