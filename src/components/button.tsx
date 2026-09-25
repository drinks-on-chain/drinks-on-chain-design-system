"use client";

import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import { Spinner } from "./spinner";

export const buttonVariants = cva(
  [
    "relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-transparent",
    "font-ui leading-none font-medium tracking-[0.01em] whitespace-nowrap no-underline select-none",
    "transition-[background-color,color,border-color,translate] active:translate-y-px",
    "disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-45",
    "[&_svg]:shrink-0",
    focusRing,
  ],
  {
    variants: {
      size: {
        sm: "min-h-8 px-3 text-xs [&_svg]:size-4",
        md: "min-h-10 px-4 text-sm [&_svg]:size-4",
        lg: "min-h-12 px-6 text-md [&_svg]:size-5",
        xl: "min-h-14 px-8 text-lg [&_svg]:size-5",
        kiosk: "min-h-18 rounded-lg px-10 text-2xl [&_svg]:size-7",
      },
      variant: {
        primary:
          "border-accent bg-accent text-accent-fg hover:border-accent-text hover:bg-accent-text",
        secondary: "border-border-strong bg-transparent text-fg hover:bg-bg-sunken",
        tertiary: "bg-transparent px-2 text-accent-text underline-offset-[3px] hover:underline",
        destructive: "border-danger bg-danger text-on-status hover:bg-danger/90",
        success: "border-success bg-success text-on-status hover:bg-success/90",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { size: "md", variant: "primary" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Muestra un spinner, marca aria-busy y desactiva el botón. */
  loading?: boolean;
  /** Icono antes del texto. */
  iconStart?: ReactNode;
  /** Icono después del texto. */
  iconEnd?: ReactNode;
  /** Renderiza el hijo (p. ej. un enlace) con los estilos del botón. */
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Botón. Primario en oro (uno por pantalla), secundario con borde, terciario de texto,
 * destructivo y éxito (solo aprobar / rechazar). Tamaños sm, md, lg, xl (táctil 56 px) y kiosk (72 px).
 */
export function Button({
  variant,
  size,
  block,
  loading = false,
  iconStart,
  iconEnd,
  asChild = false,
  disabled,
  type,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, block }), className);

  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      type={type ?? "button"}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner size="sm" decorative /> : iconStart}
      {children}
      {iconEnd}
    </button>
  );
}
