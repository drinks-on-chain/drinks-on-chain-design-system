import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface PageShellProps {
  /** Cabecera del sitio (por encima de la columna). */
  header?: ReactNode;
  /** Pie de descubrimiento. */
  footer?: ReactNode;
  /** Encabezado pequeño en versalitas espaciadas ("Valle de Cinti"). */
  eyebrow?: ReactNode;
  /** Título editorial en oro para texto. */
  title?: ReactNode;
  /** Entradilla bajo el título. */
  lead?: ReactNode;
  /** Ancho de la columna: prosa (~62 caracteres) o ancho (1200 px). */
  width?: "prose" | "wide";
  className?: string;
  contentClassName?: string;
  children?: ReactNode;
}

/**
 * Columna editorial centrada (landings, visor e historia de la bodega en el Marketplace):
 * encabezado pequeño, separador vertical, título en oro y prosa en EB Garamond.
 */
export function PageShell({
  header,
  footer,
  eyebrow,
  title,
  lead,
  width = "prose",
  className,
  contentClassName,
  children,
}: PageShellProps) {
  return (
    <div className={cn("min-h-dvh bg-bg font-text text-fg", className)}>
      {header}
      <main
        className={cn(
          "mx-auto w-full px-6 py-12 md:py-16",
          width === "prose" ? "max-w-[46rem]" : "max-w-(--doc-store-max)",
        )}
      >
        {eyebrow || title ? (
          <header className="mb-10 text-center">
            {eyebrow ? (
              <p className="m-0 font-display text-sm leading-[2.5] tracking-eyebrow text-fg-muted uppercase">
                {eyebrow}
              </p>
            ) : null}
            {eyebrow && title ? (
              <span aria-hidden="true" className="mx-auto my-4 block h-10 w-px bg-rule" />
            ) : null}
            {title ? (
              <h1 className="m-0 font-display text-3xl leading-[1.25] font-medium tracking-[0.12em] text-accent-text md:text-4xl">
                {title}
              </h1>
            ) : null}
            {lead ? (
              <p className="mx-auto mt-6 mb-0 max-w-[52ch] text-lg leading-editorial text-fg-muted">
                {lead}
              </p>
            ) : null}
          </header>
        ) : null}
        <div
          className={cn(
            "text-lg leading-editorial [&_p]:m-0 [&_p+p]:mt-[1.4em]",
            width === "prose" && "mx-auto max-w-[62ch]",
            contentClassName,
          )}
        >
          {children}
        </div>
      </main>
      {footer}
    </div>
  );
}
