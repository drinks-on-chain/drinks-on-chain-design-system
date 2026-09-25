"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

export interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  /** Muestra el botón de reintento. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Reintento en curso. */
  retrying?: boolean;
  /** Detalle técnico (código de error) en monoespaciada. */
  detail?: ReactNode;
  bare?: boolean;
  /** Nivel del título (por defecto 2, bajo el h1 de la página). */
  headingLevel?: 2 | 3 | 4;
}

/** Estado de error con reintento: obligatorio en cada pantalla con datos (05 §4). */
export function ErrorState({
  title = "No se pudo cargar",
  description = "Revisa tu conexión e inténtalo de nuevo.",
  onRetry,
  retryLabel = "Reintentar",
  retrying = false,
  detail,
  bare = false,
  headingLevel = 2,
  className,
  ...props
}: ErrorStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div
      role="alert"
      className={cn(
        "grid place-items-center gap-2 px-6 py-12 text-center font-ui text-fg-muted",
        !bare && "rounded-md border border-danger/40 bg-danger-soft",
        className,
      )}
      {...props}
    >
      <TriangleAlert aria-hidden className="mb-1 size-8 stroke-[1.5] text-danger" />
      <Heading className="m-0 font-display text-xl leading-tight font-medium text-fg">
        {title}
      </Heading>
      {description ? <p className="m-0 max-w-[40ch] text-sm">{description}</p> : null}
      {detail ? <code className="font-mono text-xs text-fg-subtle">{detail}</code> : null}
      {onRetry ? (
        <Button
          variant="secondary"
          size="sm"
          className="mt-2"
          loading={retrying}
          iconStart={<RotateCcw aria-hidden />}
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
