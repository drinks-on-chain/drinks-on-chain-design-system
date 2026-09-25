import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export const cardVariants = cva("rounded-md border border-border text-fg", {
  variants: {
    variant: {
      raised: "bg-bg-raised",
      flat: "bg-transparent",
      sunken: "bg-bg-sunken",
    },
    padding: { none: "p-0", sm: "p-3", md: "p-5", lg: "p-6" },
    radius: { md: "rounded-md", lg: "rounded-lg" },
    /** Seleccionado: borde y trazo interior en oro. */
    selected: { true: "border-accent shadow-[inset_0_0_0_1px_var(--doc-accent)]" },
    interactive: {
      true: "cursor-pointer transition-[border-color] hover:border-border-strong",
    },
  },
  defaultVariants: { variant: "raised", padding: "md", radius: "md" },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

/** Superficie con hairline, sin sombra. `radius="lg"` para tarjetas del Marketplace. */
export function Card({
  variant,
  padding,
  radius,
  selected,
  interactive,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding, radius, selected, interactive }), className)}
      {...props}
    />
  );
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Acción a la derecha (p. ej. "Ver todas"). */
  action?: ReactNode;
  /** Separa la cabecera del cuerpo con una hairline (tarjetas con tabla). */
  divided?: boolean;
}

/** Cabecera de tarjeta: título, descripción y acción. */
export function CardHeader({
  title,
  description,
  action,
  divided = false,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        divided ? "border-b border-border px-5 py-3.5" : "mb-3",
        className,
      )}
      {...props}
    >
      <div className="grid min-w-0 gap-0.5">
        <strong className="font-ui text-md font-semibold text-fg">{title}</strong>
        {description ? <span className="text-xs text-fg-subtle">{description}</span> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}
