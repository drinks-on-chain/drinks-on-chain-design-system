import { Check } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface StepperStep {
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: StepperStep[];
  /** Índice (desde 0) del paso actual. */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Texto accesible de los pasos completados. */
  completedLabel?: string;
}

/** Pasos numerados (checkout, asistentes). El actual lleva aria-current="step". */
export function Stepper({
  steps,
  current,
  orientation = "horizontal",
  completedLabel = "completado",
  className,
  ...props
}: StepperProps) {
  return (
    <ol
      className={cn(
        "m-0 flex list-none gap-4 p-0 font-ui text-sm",
        orientation === "vertical" ? "flex-col" : "flex-wrap items-center",
        className,
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={index}
            aria-current={active ? "step" : undefined}
            className={cn(
              "flex items-center gap-2",
              active ? "font-medium text-fg" : done ? "text-fg-muted" : "text-fg-subtle",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full border text-xs tabular-nums",
                active && "border-accent bg-accent text-accent-fg",
                done && "border-fg bg-fg text-bg",
                !active && !done && "border-border-strong",
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={2.5} /> : index + 1}
            </span>
            <span className="grid">
              <span>
                {step.label}
                {done ? <span className="sr-only"> ({completedLabel})</span> : null}
              </span>
              {step.description ? (
                <span className="text-xs font-normal text-fg-subtle">{step.description}</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
