"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import { Checkbox } from "./checkbox";
import { EmptyState } from "./empty-state";
import { Skeleton } from "./skeleton";

export type SortDirection = "asc" | "desc";

export interface SortState {
  columnId: string;
  direction: SortDirection;
}

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  /** Valor de la celda: clave de la fila o función. Se usa para ordenar y como contenido por defecto. */
  accessor?: keyof T | ((row: T) => unknown);
  /** Contenido propio de la celda. */
  cell?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  /** Comparador propio (por defecto compara el valor de `accessor`). */
  sortFn?: (a: T, b: T) => number;
  /** Cifras: alinea a la derecha con tabular-nums. */
  numeric?: boolean;
  align?: "left" | "center" | "right";
  /** Ancho CSS (p. ej. "120px", "20%"). */
  width?: string;
  /** Oculta la columna por debajo de un ancho (prioriza columnas en móvil). */
  hideBelow?: "md" | "lg" | "xl";
  className?: string;
  headerClassName?: string;
}

export interface DataTableLabels {
  selectAll?: string;
  selectRow?: string;
  actions?: string;
  loading?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

const defaultLabels: Required<DataTableLabels> = {
  selectAll: "Seleccionar todas las filas",
  selectRow: "Seleccionar fila",
  actions: "Acciones",
  loading: "Cargando…",
  emptyTitle: "Sin resultados",
  emptyDescription: "No hay elementos que mostrar con estos filtros.",
};

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Id estable de cada fila (selección, claves). */
  getRowId: (row: T, index: number) => string;
  /** "comfortable" (ERP, filas de 44 px) o "compact" (Backoffice, 36 px). */
  density?: "comfortable" | "compact";

  /** Orden controlado. */
  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  /** El orden lo aplica el servidor: no se reordena en cliente. */
  manualSorting?: boolean;

  /** Añade una columna de casillas. */
  selectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;

  /** Acciones por fila (normalmente un Menu), en la última columna. */
  rowActions?: (row: T) => ReactNode;
  /** Fila resaltada (p. ej. la abierta en un SlideOver). */
  activeRowId?: string;
  /** Clic en la fila (complemento de ratón; la acción debe existir también como enlace o botón). */
  onRowClick?: (row: T) => void;

  loading?: boolean;
  /** Filas de esqueleto mientras carga. */
  loadingRows?: number;
  /** Contenido cuando no hay filas (por defecto un EmptyState). */
  empty?: ReactNode;

  /** Cabecera pegajosa dentro del contenedor (por defecto sí); solo actúa con `maxHeight`. */
  stickyHeader?: boolean;
  /** Alto máximo con scroll propio; la cabecera se pega dentro del contenedor. */
  maxHeight?: string;
  /** Sin borde ni radio exterior (tablas a sangre del Backoffice). */
  bleed?: boolean;
  /** Título accesible de la tabla. */
  caption?: ReactNode;
  captionHidden?: boolean;
  labels?: DataTableLabels;
  className?: string;
}

const hideClasses = {
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

function getValue<T>(row: T, column: DataTableColumn<T>): unknown {
  const { accessor } = column;
  if (accessor === undefined) return undefined;
  return typeof accessor === "function" ? accessor(row) : row[accessor];
}

const collator = new Intl.Collator("es", { numeric: true, sensitivity: "base" });

/** Comparación por defecto: números, fechas y texto (es); vacíos al final. */
export function compareValues(a: unknown, b: unknown): number {
  const emptyA = a === null || a === undefined || a === "";
  const emptyB = b === null || b === undefined || b === "";
  if (emptyA || emptyB) return emptyA === emptyB ? 0 : emptyA ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  return collator.compare(String(a), String(b));
}

function nextSort(current: SortState | null, columnId: string): SortState | null {
  if (!current || current.columnId !== columnId) return { columnId, direction: "asc" };
  if (current.direction === "asc") return { columnId, direction: "desc" };
  return null;
}

/**
 * Tabla de datos tipada: ordenación, densidad, selección, acciones por fila,
 * cabecera pegajosa y estados de carga y vacío.
 */
export function DataTable<T>({
  data,
  columns,
  getRowId,
  density = "comfortable",
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  manualSorting = false,
  selectable = false,
  selectedIds: selectedProp,
  defaultSelectedIds = [],
  onSelectionChange,
  rowActions,
  activeRowId,
  onRowClick,
  loading = false,
  loadingRows = 5,
  empty,
  stickyHeader = true,
  maxHeight,
  bleed = false,
  caption,
  captionHidden = true,
  labels: labelsProp,
  className,
}: DataTableProps<T>) {
  const labels = { ...defaultLabels, ...labelsProp };
  const [sortState, setSortState] = useState<SortState | null>(defaultSort);
  const sort = sortProp !== undefined ? sortProp : sortState;
  const [selectionState, setSelectionState] = useState<string[]>(defaultSelectedIds);
  const selected = selectedProp ?? selectionState;
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const updateSort = (columnId: string) => {
    const next = nextSort(sort, columnId);
    if (sortProp === undefined) setSortState(next);
    onSortChange?.(next);
  };

  const updateSelection = (ids: string[]) => {
    if (selectedProp === undefined) setSelectionState(ids);
    onSelectionChange?.(ids);
  };

  const rows = useMemo(() => {
    if (!sort || manualSorting) return data;
    const column = columns.find((candidate) => candidate.id === sort.columnId);
    if (!column) return data;
    const factor = sort.direction === "asc" ? 1 : -1;
    const compare =
      column.sortFn ?? ((a: T, b: T) => compareValues(getValue(a, column), getValue(b, column)));
    return [...data].sort((a, b) => compare(a, b) * factor);
  }, [data, columns, sort, manualSorting]);

  const rowIds = rows.map((row, index) => getRowId(row, index));
  const allSelected = rowIds.length > 0 && rowIds.every((id) => selectedSet.has(id));
  const someSelected = !allSelected && rowIds.some((id) => selectedSet.has(id));
  const columnCount = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);

  const cellPadding = density === "compact" ? "px-3 py-[7px]" : "px-3 py-3";
  const headPadding = density === "compact" ? "px-3 py-2" : "px-3 py-2.5";
  const alignClass = (column: DataTableColumn<T>) =>
    column.numeric || column.align === "right"
      ? "text-right"
      : column.align === "center"
        ? "text-center"
        : "text-left";

  // La tabla tiene scroll horizontal propio, así que la cabecera solo puede pegarse dentro de su
  // contenedor: sin `maxHeight` quedaría desplazada sobre las primeras filas.
  const sticky = stickyHeader && Boolean(maxHeight);
  const headClasses = cn(
    "border-b border-border-strong bg-bg-sunken font-ui text-2xs leading-tight font-medium tracking-label whitespace-nowrap text-fg-subtle uppercase",
    sticky && "sticky z-sticky",
    headPadding,
  );
  const stickyStyle: CSSProperties | undefined = sticky ? { top: 0 } : undefined;

  return (
    <div
      className={cn(
        "w-full font-ui text-sm text-fg",
        // Siempre con scroll horizontal propio: una tabla ancha nunca desborda la página.
        maxHeight ? "overflow-auto" : "overflow-x-auto",
        !bleed && "rounded-md border border-border",
        className,
      )}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table
        className={cn(
          "w-full border-separate border-spacing-0",
          "[&>tbody>tr:last-child>td]:border-b-0",
          !bleed &&
            "[&>thead>tr>th:first-child]:rounded-tl-[3px] [&>thead>tr>th:last-child]:rounded-tr-[3px]",
        )}
      >
        {caption ? (
          <caption className={cn(captionHidden ? "sr-only" : "px-3 py-2 text-left font-medium")}>
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            {selectable ? (
              <th scope="col" className={cn(headClasses, "w-10")} style={stickyStyle}>
                <Checkbox
                  aria-label={labels.selectAll}
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  disabled={loading || rowIds.length === 0}
                  onCheckedChange={(checked) => {
                    const others = selected.filter((id) => !rowIds.includes(id));
                    updateSelection(checked === true ? [...others, ...rowIds] : others);
                  }}
                />
              </th>
            ) : null}
            {columns.map((column) => {
              const active = sort?.columnId === column.id ? sort.direction : undefined;
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={
                    column.sortable
                      ? active === "asc"
                        ? "ascending"
                        : active === "desc"
                          ? "descending"
                          : "none"
                      : undefined
                  }
                  className={cn(
                    headClasses,
                    alignClass(column),
                    column.hideBelow && hideClasses[column.hideBelow],
                    column.headerClassName,
                  )}
                  style={{ ...stickyStyle, width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => updateSort(column.id)}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-1 rounded-sm uppercase hover:text-fg",
                        active && "text-fg",
                        (column.numeric || column.align === "right") && "flex-row-reverse",
                        focusRing,
                      )}
                    >
                      {column.header}
                      {active === "asc" ? (
                        <ArrowUp className="size-3.5" aria-hidden />
                      ) : active === "desc" ? (
                        <ArrowDown className="size-3.5" aria-hidden />
                      ) : (
                        <ChevronsUpDown className="size-3.5 opacity-50" aria-hidden />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
            {rowActions ? (
              <th scope="col" className={cn(headClasses, "w-12")} style={stickyStyle}>
                <span className="sr-only">{labels.actions}</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody aria-busy={loading || undefined}>
          {loading ? (
            Array.from({ length: loadingRows }, (_, rowIndex) => (
              <tr key={`loading-${rowIndex}`}>
                {Array.from({ length: columnCount }, (_, cellIndex) => (
                  <td key={cellIndex} className={cn("border-b border-border", cellPadding)}>
                    {rowIndex === 0 && cellIndex === 0 ? (
                      <span className="sr-only" role="status">
                        {labels.loading}
                      </span>
                    ) : null}
                    <Skeleton className={cellIndex % 2 ? "w-[60%]" : "w-[80%]"} />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="p-0">
                {empty ?? (
                  <EmptyState
                    bare
                    title={labels.emptyTitle}
                    description={labels.emptyDescription}
                  />
                )}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const id = rowIds[index] ?? String(index);
              const isSelected = selectedSet.has(id);
              return (
                <tr
                  key={id}
                  data-selected={isSelected || undefined}
                  data-active={activeRowId === id || undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "group/row [&>td]:transition-[background-color] hover:[&>td]:bg-bg-raised",
                    "data-active:[&>td]:bg-accent-soft data-selected:[&>td]:bg-accent-soft",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {selectable ? (
                    <td className={cn("border-b border-border", cellPadding)}>
                      <Checkbox
                        aria-label={labels.selectRow}
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onCheckedChange={(checked) =>
                          updateSelection(
                            checked === true
                              ? [...selected, id]
                              : selected.filter((value) => value !== id),
                          )
                        }
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "border-b border-border align-middle",
                        cellPadding,
                        alignClass(column),
                        column.numeric && "tabular-nums",
                        column.hideBelow && hideClasses[column.hideBelow],
                        column.className,
                      )}
                    >
                      {column.cell ? column.cell(row, index) : (getValue(row, column) as ReactNode)}
                    </td>
                  ))}
                  {rowActions ? (
                    <td
                      className={cn(
                        "border-b border-border text-right",
                        density === "compact" ? "px-2 py-0.5" : "px-2 py-1.5",
                      )}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {rowActions(row)}
                    </td>
                  ) : null}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
