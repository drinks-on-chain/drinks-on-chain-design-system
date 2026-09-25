"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";

export type PageItem = number | "ellipsis-start" | "ellipsis-end";

/**
 * Páginas a mostrar con elipsis: siempre la primera y la última,
 * la actual y `siblingCount` a cada lado.
 */
export function getPageItems(current: number, pageCount: number, siblingCount = 1): PageItem[] {
  const totalSlots = siblingCount * 2 + 5;
  if (pageCount <= totalSlots) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const start = Math.max(2, current - siblingCount);
  const end = Math.min(pageCount - 1, current + siblingCount);
  const showStartEllipsis = start > 3;
  const showEndEllipsis = end < pageCount - 2;
  const items: PageItem[] = [1];
  if (showStartEllipsis) items.push("ellipsis-start");
  else for (let page = 2; page < start; page++) items.push(page);
  for (let page = start; page <= end; page++) items.push(page);
  if (showEndEllipsis) items.push("ellipsis-end");
  else for (let page = end + 1; page < pageCount; page++) items.push(page);
  items.push(pageCount);
  return items;
}

export interface PaginationLabels {
  nav?: string;
  previous?: string;
  next?: string;
  page?: (page: number) => string;
  range?: (from: number, to: number, total: number) => string;
  empty?: string;
}

const defaultLabels: Required<PaginationLabels> = {
  nav: "Paginación",
  previous: "Página anterior",
  next: "Página siguiente",
  page: (page) => `Página ${page}`,
  range: (from, to, total) => `${from}–${to} de ${total}`,
  empty: "Sin resultados",
};

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Total de elementos (no de páginas). */
  total: number;
  /** Elementos por página (`limit` de la API). */
  limit: number;
  /** Desplazamiento actual (`offset` de la API). */
  offset: number;
  /** Recibe el nuevo `offset`. */
  onOffsetChange: (offset: number) => void;
  siblingCount?: number;
  /** Muestra "1–20 de 48". */
  showRange?: boolean;
  labels?: PaginationLabels;
}

const buttonClasses = [
  "inline-grid h-8 min-w-8 cursor-pointer place-items-center rounded-md border border-border bg-transparent px-2",
  "font-ui text-sm text-fg-muted tabular-nums transition-[background-color,color] hover:bg-bg-sunken hover:text-fg",
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
  "aria-[current=page]:border-fg aria-[current=page]:bg-fg aria-[current=page]:text-bg",
  focusRing,
].join(" ");

/** Paginación por `limit` / `offset`, como las listas de la API. */
export function Pagination({
  total,
  limit,
  offset,
  onOffsetChange,
  siblingCount = 1,
  showRange = true,
  labels: labelsProp,
  className,
  ...props
}: PaginationProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const safeLimit = Math.max(1, limit);
  const pageCount = Math.max(1, Math.ceil(total / safeLimit));
  const current = Math.min(pageCount, Math.floor(Math.max(0, offset) / safeLimit) + 1);
  const goTo = (page: number) => onOffsetChange((page - 1) * safeLimit);
  const from = total === 0 ? 0 : (current - 1) * safeLimit + 1;
  const to = Math.min(total, current * safeLimit);

  return (
    <nav
      aria-label={labels.nav}
      className={cn("flex flex-wrap items-center gap-2 font-ui text-sm text-fg-subtle", className)}
      {...props}
    >
      <button
        type="button"
        className={buttonClasses}
        aria-label={labels.previous}
        disabled={current <= 1}
        onClick={() => goTo(current - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>
      {getPageItems(current, pageCount, siblingCount).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            className={buttonClasses}
            aria-label={labels.page(item)}
            aria-current={item === current ? "page" : undefined}
            onClick={() => goTo(item)}
          >
            {item}
          </button>
        ) : (
          <span key={item} aria-hidden="true" className="px-1">
            …
          </span>
        ),
      )}
      <button
        type="button"
        className={buttonClasses}
        aria-label={labels.next}
        disabled={current >= pageCount}
        onClick={() => goTo(current + 1)}
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
      {showRange ? (
        <span className="ml-1 tabular-nums" aria-live="polite">
          {total === 0 ? labels.empty : labels.range(from, to, total)}
        </span>
      ) : null}
    </nav>
  );
}
