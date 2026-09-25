"use client";

import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, Ref } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";

export const iconButtonVariants = cva(
  [
    "inline-grid shrink-0 cursor-pointer place-items-center rounded-md border border-transparent",
    "transition-[background-color,color,border-color]",
    "disabled:cursor-not-allowed disabled:opacity-45",
    "[&_svg]:shrink-0",
    focusRing,
  ],
  {
    variants: {
      variant: {
        ghost: "bg-transparent text-fg-muted hover:bg-bg-sunken hover:text-fg",
        outline: "border-border-strong bg-transparent text-fg hover:bg-bg-sunken",
        solid: "border-accent bg-accent text-accent-fg hover:bg-accent-text",
      },
      size: {
        sm: "size-8 [&_svg]:size-4",
        md: "size-10 [&_svg]:size-5",
        lg: "size-12 [&_svg]:size-5",
        xl: "size-14 [&_svg]:size-6",
      },
      round: { true: "rounded-full" },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  },
);

export interface IconButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">,
    VariantProps<typeof iconButtonVariants> {
  /** Nombre accesible obligatorio (el botón solo muestra un icono). */
  label: string;
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/** Botón cuadrado con un solo icono y nombre accesible. */
export function IconButton({
  label,
  variant,
  size,
  round,
  asChild = false,
  type,
  className,
  children,
  ...props
}: IconButtonProps) {
  const classes = cn(iconButtonVariants({ variant, size, round }), className);
  if (asChild) {
    return (
      <Slot.Root aria-label={label} className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }
  return (
    <button type={type ?? "button"} aria-label={label} className={classes} {...props}>
      {children}
    </button>
  );
}
