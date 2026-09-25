import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** "strong" usa el trazo de separador editorial. */
  strength?: "hairline" | "strong";
  /** Texto centrado sobre la línea ("o"). */
  label?: ReactNode;
  /** Solo visual (aria-hidden) en lugar de role="separator". */
  decorative?: boolean;
}

/** Separador de 1 px. */
export function Divider({
  orientation = "horizontal",
  strength = "hairline",
  label,
  decorative = false,
  className,
  ...props
}: DividerProps) {
  const line = strength === "strong" ? "bg-rule" : "bg-border";
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "separator", "aria-orientation": orientation };

  if (label && orientation === "horizontal") {
    return (
      <div
        {...a11y}
        className={cn("my-4 flex items-center gap-3 text-xs text-fg-subtle", className)}
        {...props}
      >
        <span className={cn("h-px flex-1", line)} />
        <span>{label}</span>
        <span className={cn("h-px flex-1", line)} />
      </div>
    );
  }
  return (
    <div
      {...a11y}
      className={cn(
        "shrink-0",
        line,
        orientation === "horizontal" ? "my-4 h-px w-full" : "mx-2 w-px self-stretch",
        className,
      )}
      {...props}
    />
  );
}
