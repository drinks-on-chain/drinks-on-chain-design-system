import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import type { Tone } from "../lib/types";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor actual; sin valor la barra es indeterminada. */
  value?: number;
  max?: number;
  tone?: Extract<Tone, "accent" | "success" | "warning" | "danger" | "info">;
  size?: "sm" | "md";
  /** Nombre accesible (obligatorio si no hay etiqueta visible asociada). */
  label?: string;
  /** Texto del valor para lectores ("38 días restantes"). */
  valueText?: string;
}

const toneClasses = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

/** Barra de progreso fina. */
export function Progress({
  value,
  max = 100,
  tone = "accent",
  size = "md",
  label,
  valueText,
  className,
  ...props
}: ProgressProps) {
  const indeterminate = value === undefined;
  const percent = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuetext={valueText}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-bg-deep",
        size === "md" ? "h-1.5" : "h-1",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "block h-full transition-[width] duration-(--doc-dur-transition)",
          toneClasses[tone],
          indeterminate && "w-1/3 animate-pulse",
        )}
        style={indeterminate ? undefined : { width: `${percent}%` }}
      />
    </div>
  );
}
