import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import type { Tone } from "../lib/types";

export const badgeVariants = cva(
  [
    "inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-sm px-2 align-middle",
    "font-ui text-xs leading-none font-medium tracking-[0.02em] whitespace-nowrap",
  ],
  {
    variants: {
      tone: {
        neutral: "",
        accent: "",
        success: "",
        danger: "",
        warning: "",
        info: "",
      } satisfies Record<Tone, string>,
      variant: { soft: "", strong: "" },
      size: { md: "", lg: "h-7 px-2.5 text-sm" },
    },
    compoundVariants: [
      { variant: "soft", tone: "neutral", className: "bg-bg-deep text-fg-muted" },
      { variant: "soft", tone: "accent", className: "bg-accent-soft text-accent-text" },
      { variant: "soft", tone: "success", className: "bg-success-soft text-success-text" },
      { variant: "soft", tone: "danger", className: "bg-danger-soft text-danger-text" },
      { variant: "soft", tone: "warning", className: "bg-warning-soft text-warning-text" },
      { variant: "soft", tone: "info", className: "bg-info-soft text-info-text" },
      { variant: "strong", tone: "neutral", className: "bg-fg text-bg" },
      { variant: "strong", tone: "accent", className: "bg-accent text-accent-fg" },
      { variant: "strong", tone: "success", className: "bg-success text-on-status" },
      { variant: "strong", tone: "danger", className: "bg-danger text-on-status" },
      { variant: "strong", tone: "warning", className: "bg-warning text-on-status" },
      { variant: "strong", tone: "info", className: "bg-info text-on-status" },
    ],
    defaultVariants: { tone: "neutral", variant: "soft", size: "md" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Punto de estado a la izquierda (por defecto sí). */
  dot?: boolean;
}

/** Estado con punto de color. Soft para listas y tablas; strong para el estado clave. */
export function Badge({
  tone,
  variant,
  size,
  dot = true,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, variant, size }), className)} {...props}>
      {dot ? (
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
      ) : null}
      {children}
    </span>
  );
}
