import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
import { labelText } from "../lib/styles";
import type { Tone } from "../lib/types";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** Complemento pequeño junto a la cifra ("/ 8", "kg"). */
  unit?: ReactNode;
  /** Variación o contexto bajo la cifra. */
  delta?: ReactNode;
  /** Sentido de la variación: colorea `delta`. */
  trend?: "up" | "down" | "neutral";
  /** Tono de la cifra (p. ej. "warning" para alertas). */
  tone?: Extract<Tone, "neutral" | "warning" | "danger" | "success">;
}

const toneClasses = {
  neutral: "text-fg",
  warning: "text-warning",
  danger: "text-danger",
  success: "text-success",
};

/** Tarjeta de KPI: etiqueta, cifra display de 36 px y variación. */
export function StatCard({
  label,
  value,
  unit,
  delta,
  trend = "neutral",
  tone = "neutral",
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "grid content-start gap-1 rounded-md border border-border bg-bg-raised p-5",
        className,
      )}
      {...props}
    >
      <span className={cn(labelText, "mb-0.5")}>{label}</span>
      <span
        className={cn(
          "font-display text-4xl leading-none font-medium lining-nums tabular-nums",
          toneClasses[tone],
        )}
      >
        {value}
        {unit ? <span className="ml-1 text-lg text-fg-subtle">{unit}</span> : null}
      </span>
      {delta ? (
        <span
          className={cn(
            "text-xs",
            trend === "up" && "text-success",
            trend === "down" && "text-danger",
            trend === "neutral" && "text-fg-subtle",
          )}
        >
          {delta}
        </span>
      ) : null}
    </div>
  );
}
