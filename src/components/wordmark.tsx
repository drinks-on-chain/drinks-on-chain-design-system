import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface WordmarkProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Versión compacta "DoC" para la barra lateral colapsada. */
  compact?: boolean;
}

const sizes = { sm: "text-sm", md: "text-md", lg: "text-lg", xl: "text-xl", "2xl": "text-2xl" };

/** "Drinks on Chain" en Cormorant Garamond, con "on" en oro para texto. */
export function Wordmark({ size = "lg", compact = false, className, ...props }: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-display leading-none font-medium tracking-wordmark whitespace-nowrap text-fg uppercase",
        sizes[size],
        className,
      )}
      {...props}
    >
      {compact ? (
        <abbr title="Drinks on Chain" className="no-underline">
          D<em className="text-accent-text not-italic">o</em>C
        </abbr>
      ) : (
        <>
          Drinks <em className="text-accent-text not-italic">on</em> Chain
        </>
      )}
    </span>
  );
}
