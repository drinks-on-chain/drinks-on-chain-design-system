"use client";

import { X } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

export interface BulkActionBarLabels {
  region?: string;
  selected?: (count: number) => string;
  clear?: string;
}

const defaultLabels: Required<BulkActionBarLabels> = {
  region: "Acciones masivas",
  selected: (count) => (count === 1 ? "1 seleccionada" : `${count} seleccionadas`),
  clear: "Quitar selección",
};

export interface BulkActionBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Filas seleccionadas. */
  count: number;
  /** Acciones sobre la selección (botones sm). */
  children?: ReactNode;
  /** Quita la selección; muestra el botón "Quitar selección". */
  onClear?: () => void;
  /** Anuncia el recuento con `aria-live` (DataTable lo anuncia por su cuenta). */
  announce?: boolean;
  labels?: BulkActionBarLabels;
}

/** Barra de acciones sobre las filas seleccionadas de una tabla (suspender, reenviar, exportar…). */
export function BulkActionBar({
  count,
  children,
  onClear,
  announce = true,
  labels: labelsProp,
  className,
  ...props
}: BulkActionBarProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  return (
    <div
      role="region"
      aria-label={labels.region}
      className={cn(
        "flex min-h-11 flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-border-strong bg-bg-sunken px-3 py-1.5 font-ui text-sm text-fg",
        className,
      )}
      {...props}
    >
      <span
        className="font-medium tabular-nums"
        aria-live={announce ? "polite" : undefined}
        aria-atomic={announce ? true : undefined}
      >
        {labels.selected(count)}
      </span>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
      {onClear ? (
        <Button
          variant="tertiary"
          size="sm"
          className="ml-auto text-fg-muted"
          iconStart={<X aria-hidden />}
          onClick={onClear}
        >
          {labels.clear}
        </Button>
      ) : null}
    </div>
  );
}
