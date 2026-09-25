import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface BrandSealProps extends HTMLAttributes<HTMLSpanElement> {
  /** Línea superior en versalitas. */
  eyebrow?: ReactNode;
  /** Línea inferior en cursiva: procedencia o nombre de la aplicación ("ERP de trazabilidad"). */
  tagline?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { box: "min-w-56", eyebrow: "text-[0.55rem]", name: "text-xl", tagline: "text-xs" },
  md: { box: "min-w-72", eyebrow: "text-[0.7rem]", name: "text-3xl", tagline: "text-sm" },
  lg: { box: "min-w-96", eyebrow: "text-xs", name: "text-4xl", tagline: "text-md" },
};

/**
 * La chapa de Drinks on Chain, como en las landings: versalitas arriba, el nombre entre dos
 * hilos de oro y una línea en cursiva abajo. Es la marca de las pantallas de acceso.
 */
export function BrandSeal({
  eyebrow = "Vinos & Singani de altura",
  tagline = "Bodegas de Tarija y Cinti · Bolivia",
  size = "md",
  className,
  ...props
}: BrandSealProps) {
  const s = sizes[size];
  return (
    <span
      className={cn(
        "inline-flex max-w-full flex-col items-center text-center font-display text-fg select-none",
        s.box,
        className,
      )}
      {...props}
    >
      {/* padding-left compensa ópticamente el espaciado final de las versalitas */}
      <span
        className={cn(
          "pl-[0.45em] tracking-[0.45em] whitespace-nowrap text-fg-subtle uppercase",
          s.eyebrow,
        )}
      >
        {eyebrow}
      </span>
      <span className="mt-[0.45em] flex w-full flex-col items-stretch">
        <span aria-hidden="true" className="block h-px bg-accent" />
        <span
          className={cn(
            "block pr-[0.15em] pl-[0.35em] leading-[1.45] font-medium tracking-[0.2em] whitespace-nowrap text-accent-text uppercase",
            s.name,
          )}
        >
          Drinks on Chain
        </span>
        <span aria-hidden="true" className="block h-px bg-accent" />
      </span>
      <span
        className={cn(
          "mt-[0.55em] pl-[0.22em] tracking-[0.22em] whitespace-nowrap text-fg-subtle italic",
          s.tagline,
        )}
      >
        {tagline}
      </span>
    </span>
  );
}
