"use client";

import { Select as SelectPrimitive } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";
import { fieldFocus } from "../lib/styles";
import { useFieldControl } from "./field";

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  ComponentProps<typeof SelectPrimitive.Root>,
  "children" | "dir"
> {
  /** Opciones simples; para grupos usa `children` con SelectItem / SelectGroup. */
  options?: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  id?: string;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  children?: ReactNode;
}

const triggerSizes = { sm: "min-h-8 text-sm", md: "min-h-10 text-md", lg: "min-h-14 text-lg" };

/** Selector accesible (Radix Select) con el aspecto de los campos del sistema. */
export function Select({
  options,
  placeholder = "Selecciona…",
  size = "md",
  invalid,
  id,
  className,
  contentClassName,
  children,
  required,
  disabled,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SelectProps) {
  const control = useFieldControl({
    id,
    invalid,
    required,
    disabled,
    "aria-describedby": ariaDescribedBy,
  });
  return (
    <SelectPrimitive.Root required={control.required} disabled={control.disabled} {...props}>
      <SelectPrimitive.Trigger
        id={control.id}
        aria-label={ariaLabel}
        aria-labelledby={control["aria-labelledby"]}
        aria-describedby={control["aria-describedby"]}
        aria-invalid={control["aria-invalid"]}
        className={cn(
          "relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-border-strong bg-bg-raised px-3 text-left font-ui text-fg",
          "transition-[border-color] data-placeholder:text-fg-subtle",
          "disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger",
          fieldFocus,
          triggerSizes[size],
          className,
        )}
      >
        <span className="truncate">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon className="shrink-0 text-fg-subtle">
          <ChevronDown className="size-4" aria-hidden />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className={cn(
            "z-dropdown max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden",
            "rounded-md border border-border bg-bg font-ui text-fg shadow-overlay",
            "data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in motion-reduce:animate-none",
            contentClassName,
          )}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export type SelectItemProps = ComponentProps<typeof SelectPrimitive.Item>;

/** Opción de Select. */
export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-pointer items-center rounded-sm py-2 pr-3 pl-8 text-sm outline-none select-none",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:bg-bg-sunken data-[state=checked]:font-medium",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 inline-flex size-4 items-center justify-center text-accent-text">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" aria-hidden />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

/** Grupo de opciones con etiqueta. */
export function SelectGroup({
  label,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Group> & { label?: ReactNode }) {
  return (
    <SelectPrimitive.Group {...props}>
      {label ? (
        <SelectPrimitive.Label className="px-2 pt-2 pb-1 text-2xs font-medium tracking-label text-fg-subtle uppercase">
          {label}
        </SelectPrimitive.Label>
      ) : null}
      {children}
    </SelectPrimitive.Group>
  );
}

/** Separador entre grupos de opciones. */
export function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn("my-1 h-px bg-border", className)} {...props} />;
}
