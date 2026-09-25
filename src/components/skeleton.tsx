import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Forma: línea de texto, bloque o círculo (avatar). */
  shape?: "line" | "block" | "circle";
}

/** Marcador de carga. Los estados de carga de pantalla usan Skeleton, no spinner. */
export function Skeleton({ shape = "line", className, ...props }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block animate-shimmer bg-[linear-gradient(90deg,var(--doc-bg-sunken),var(--doc-bg-deep),var(--doc-bg-sunken))] bg-size-[200%_100%] motion-reduce:animate-none",
        shape === "line" && "h-3.5 w-full rounded-sm",
        shape === "block" && "h-24 w-full rounded-md",
        shape === "circle" && "size-8 rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
  /** Texto para lectores de pantalla. */
  label?: string;
}

/** Varias líneas de Skeleton con anchos variados y anuncio accesible. */
export function SkeletonText({
  lines = 3,
  label = "Cargando…",
  className,
  ...props
}: SkeletonTextProps) {
  const widths = ["w-[60%]", "w-[90%]", "w-[40%]", "w-[75%]", "w-[55%]"];
  return (
    <div role="status" className={cn("grid gap-2", className)} {...props}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={widths[index % widths.length]} />
      ))}
    </div>
  );
}
