import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  /** Texto para lectores de pantalla. */
  label?: string;
  /** Solo decorativo (p. ej. dentro de un botón que ya anuncia su estado). */
  decorative?: boolean;
}

const sizes = { sm: "size-3.5 border-2", md: "size-5 border-2", lg: "size-8 border-[3px]" };

/** Indicador de carga circular. Para pantallas usa Skeleton, no un spinner a pantalla completa. */
export function Spinner({
  size = "md",
  label = "Cargando…",
  decorative = false,
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      role={decorative ? undefined : "status"}
      aria-hidden={decorative || undefined}
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      {...props}
    >
      <span
        className={cn(
          "animate-spin rounded-full border-current border-r-transparent motion-reduce:[animation-duration:1.6s]",
          sizes[size],
        )}
      />
      {decorative ? null : <span className="sr-only">{label}</span>}
    </span>
  );
}
