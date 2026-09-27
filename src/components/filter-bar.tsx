"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import { Button } from "./button";

export interface ActiveFilter {
  /** Clave del filtro (p. ej. el parámetro de la URL: "status"). */
  id: string;
  /** Nombre del filtro ("Estado"). */
  label: string;
  /** Valor legible ("Activa"); si se omite, el chip muestra solo la etiqueta. */
  value?: string;
}

export interface FilterBarLabels {
  region?: string;
  active?: string;
  clear?: string;
  remove?: (filter: ActiveFilter) => string;
}

const defaultLabels: Required<FilterBarLabels> = {
  region: "Filtros",
  active: "Filtros activos",
  clear: "Limpiar filtros",
  remove: (filter) => `Quitar filtro ${filter.label}${filter.value ? `: ${filter.value}` : ""}`,
};

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Controles de filtro: búsqueda, Select, Combobox, DateRangePicker, pills… */
  children?: ReactNode;
  /** Acciones a la derecha (exportar, crear). */
  actions?: ReactNode;
  /** Filtros aplicados, como chips que se pueden quitar. */
  filters?: ActiveFilter[];
  onRemove?: (id: string) => void;
  /** Quita todos los filtros; muestra el botón "Limpiar filtros". */
  onClearAll?: () => void;
  /** Recuento de resultados ("48 bodegas"); se anuncia con `aria-live`. */
  resultCount?: ReactNode;
  labels?: FilterBarLabels;
}

/**
 * Barra de filtros de las listas del Backoffice: controles, chips de filtros activos que se
 * quitan con teclado (el foco pasa al chip siguiente) y "Limpiar filtros".
 */
export function FilterBar({
  children,
  actions,
  filters = [],
  onRemove,
  onClearAll,
  resultCount,
  labels: labelsProp,
  className,
  ...props
}: FilterBarProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const regionRef = useRef<HTMLDivElement>(null);
  // Tras quitar un chip, el foco va al siguiente (o al anterior, o a la región).
  const pendingFocus = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (pendingFocus.current === undefined) return;
    const target = pendingFocus.current ? chipRefs.current.get(pendingFocus.current) : undefined;
    (target ?? regionRef.current)?.focus();
    pendingFocus.current = undefined;
  });

  const remove = (index: number) => {
    const filter = filters[index];
    if (!filter) return;
    pendingFocus.current = filters[index + 1]?.id ?? filters[index - 1]?.id ?? null;
    onRemove?.(filter.id);
  };

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label={labels.region}
      tabIndex={-1}
      className={cn("grid gap-2.5 font-ui text-sm outline-none", className)}
      {...props}
    >
      {children || actions ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">{children}</div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {filters.length > 0 || resultCount ? (
        <div className="flex flex-wrap items-center gap-2">
          {filters.length > 0 ? (
            <ul aria-label={labels.active} className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {filters.map((filter, index) => (
                <li
                  key={filter.id}
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-border-strong bg-bg-raised pr-1 pl-3 text-xs text-fg"
                >
                  <span className="text-fg-muted">
                    {filter.label}
                    {filter.value ? ":" : null}
                  </span>
                  {filter.value ? <span className="font-medium">{filter.value}</span> : null}
                  <button
                    type="button"
                    ref={(node) => {
                      if (node) chipRefs.current.set(filter.id, node);
                      else chipRefs.current.delete(filter.id);
                    }}
                    aria-label={labels.remove(filter)}
                    onClick={() => remove(index)}
                    className={cn(
                      "ml-0.5 inline-grid size-5 cursor-pointer place-items-center rounded-full text-fg-subtle hover:bg-bg-sunken hover:text-fg",
                      focusRing,
                    )}
                  >
                    <X className="size-3" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {filters.length > 0 && onClearAll ? (
            <Button
              variant="tertiary"
              size="sm"
              className="min-h-7"
              onClick={() => {
                pendingFocus.current = null;
                onClearAll();
              }}
            >
              {labels.clear}
            </Button>
          ) : null}
          {resultCount ? (
            <span className="ml-auto text-xs text-fg-subtle tabular-nums" aria-live="polite">
              {resultCount}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
