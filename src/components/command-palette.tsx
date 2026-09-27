"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { matchesQuery } from "../lib/text";
import { useHotkey } from "../lib/use-hotkey";
import { DialogOverlay, useReturnFocus } from "./dialog-parts";
import { Spinner } from "./spinner";

export interface CommandPaletteItem {
  id: string;
  label: string;
  /** Línea secundaria (ruta, NIT, correo). */
  description?: ReactNode;
  /** Icono de 16 px a la izquierda. */
  icon?: ReactNode;
  /** Atajo mostrado a la derecha (texto, p. ej. "G B" o el de `formatHotkey`). */
  shortcut?: string;
  /** Palabras extra para la búsqueda. */
  keywords?: string[];
  disabled?: boolean;
  /** Acción al elegir (navegar, abrir un diálogo…). */
  onSelect: () => void;
}

export interface CommandPaletteGroup {
  /** Clave estable; por defecto el encabezado. */
  id?: string;
  heading: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteLabels {
  /** Título accesible del diálogo. */
  title?: string;
  /** Nombre accesible del campo de búsqueda. */
  input?: string;
  empty?: string;
  loading?: string;
  results?: (count: number) => string;
  navigate?: string;
  select?: string;
  close?: string;
}

const defaultLabels: Required<CommandPaletteLabels> = {
  title: "Buscador global",
  input: "Buscar",
  empty: "Sin resultados",
  loading: "Buscando…",
  results: (count) => (count === 1 ? "1 resultado" : `${count} resultados`),
  navigate: "navegar",
  select: "abrir",
  close: "cerrar",
};

export interface CommandPaletteProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  groups: CommandPaletteGroup[];
  /**
   * Filtro en cliente por etiqueta y `keywords` (por defecto). `false`: la app filtra con
   * `onQueryChange` (búsqueda en el servidor) y pasa los grupos ya filtrados.
   */
  filter?: boolean | ((item: CommandPaletteItem, query: string) => boolean);
  /** Texto de búsqueda controlado. */
  query?: string;
  onQueryChange?: (query: string) => void;
  /** Búsqueda en curso (servidor). */
  loading?: boolean;
  /**
   * Atajo global que abre la paleta (por defecto "mod+k": ⌘K / Ctrl+K). `false` si otro
   * componente (p. ej. AdminShell) ya lo gestiona.
   */
  hotkey?: string | false;
  placeholder?: string;
  /** Cierra la paleta al elegir (por defecto sí). */
  closeOnSelect?: boolean;
  /** Pie propio en lugar de las ayudas de teclado. */
  footer?: ReactNode;
  labels?: CommandPaletteLabels;
  className?: string;
}

/**
 * Paleta de comandos y buscador global (⌘K / Ctrl+K): grupos, atajos, navegación con flechas,
 * Enter para abrir, Esc para cerrar y número de resultados anunciado con `aria-live`.
 */
export function CommandPalette({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  groups,
  filter = true,
  query: queryProp,
  onQueryChange,
  loading = false,
  hotkey = "mod+k",
  placeholder = "Buscar…",
  closeOnSelect = true,
  footer,
  labels: labelsProp,
  className,
}: CommandPaletteProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const [queryState, setQueryState] = useState("");
  const query = queryProp ?? queryState;
  const [activeState, setActive] = useState(0);
  const baseId = `command-${useId()}`;
  const listId = `${baseId}-list`;
  const returnFocus = useReturnFocus(false);

  const setQuery = (next: string) => {
    if (queryProp === undefined) setQueryState(next);
    onQueryChange?.(next);
  };

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
    if (!next) {
      setQuery("");
      setActive(0);
    }
  };

  useHotkey(hotkey || "", () => (open ? undefined : setOpen(true)), {
    enabled: Boolean(hotkey),
  });

  const visibleGroups = useMemo(() => {
    const test =
      filter === false
        ? null
        : typeof filter === "function"
          ? filter
          : (item: CommandPaletteItem, value: string) =>
              matchesQuery(value, item.label, ...(item.keywords ?? []));
    return groups
      .map((group) => ({
        ...group,
        items: test && query.trim() ? group.items.filter((item) => test(item, query)) : group.items,
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, filter, query]);

  const flat = visibleGroups.flatMap((group) => group.items);
  const enabled = flat.flatMap((item, index) => (item.disabled ? [] : [index]));
  const active = enabled.includes(activeState) ? activeState : (enabled[0] ?? -1);
  const optionId = (index: number) => `${baseId}-option-${index}`;

  useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // optionId depende solo de baseId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active, baseId]);

  const choose = (item: CommandPaletteItem | undefined) => {
    if (!item || item.disabled) return;
    if (closeOnSelect) setOpen(false);
    item.onSelect();
  };

  const move = (step: number) => {
    if (enabled.length === 0) return;
    const position = enabled.indexOf(active);
    const next = (position + step + enabled.length) % enabled.length;
    setActive(enabled[next]!);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        if (!event.ctrlKey && query) return;
        event.preventDefault();
        if (enabled.length) setActive(enabled[0]!);
        break;
      case "End":
        if (!event.ctrlKey && query) return;
        event.preventDefault();
        if (enabled.length) setActive(enabled[enabled.length - 1]!);
        break;
      case "Enter":
        event.preventDefault();
        choose(flat[active]);
        break;
      default:
    }
  };

  const status = loading
    ? labels.loading
    : flat.length === 0
      ? labels.empty
      : labels.results(flat.length);

  // Índice global de cada opción (para aria-activedescendant).
  const offsets = visibleGroups.map((_, groupIndex) =>
    visibleGroups.slice(0, groupIndex).reduce((sum, group) => sum + group.items.length, 0),
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          {...returnFocus}
          className={cn(
            "fixed top-[12vh] left-1/2 z-modal flex max-h-[76dvh] w-[min(640px,calc(100%-2rem))] -translate-x-1/2 flex-col",
            "overflow-hidden rounded-lg border border-border bg-bg font-ui text-fg shadow-overlay outline-none",
            "data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in motion-reduce:animate-none",
            className,
          )}
        >
          <DialogPrimitive.Title className="sr-only">{labels.title}</DialogPrimitive.Title>
          <div className="flex shrink-0 items-center gap-3 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-fg-subtle" aria-hidden />
            <input
              type="text"
              role="combobox"
              aria-label={labels.input}
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? optionId(active) : undefined}
              autoComplete="off"
              spellCheck={false}
              placeholder={placeholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              className="h-12 min-w-0 flex-1 border-0 bg-transparent text-md text-fg outline-none placeholder:text-fg-subtle"
            />
            {loading ? <Spinner size="sm" decorative /> : null}
          </div>
          <div
            id={listId}
            role="listbox"
            aria-label={labels.title}
            onMouseDown={(event) => event.preventDefault()}
            className="min-h-0 flex-1 overflow-y-auto p-1.5 empty:hidden"
          >
            {visibleGroups.map((group, groupIndex) => {
              const headingId = `${baseId}-group-${groupIndex}`;
              return (
                <div key={group.id ?? group.heading} role="group" aria-labelledby={headingId}>
                  <div
                    id={headingId}
                    role="presentation"
                    className="px-2.5 pt-2.5 pb-1 text-2xs font-medium tracking-label text-fg-subtle uppercase"
                  >
                    {group.heading}
                  </div>
                  {group.items.map((item, position) => {
                    const itemIndex = (offsets[groupIndex] ?? 0) + position;
                    return (
                      <div
                        key={item.id}
                        id={optionId(itemIndex)}
                        role="option"
                        aria-selected={itemIndex === active}
                        aria-disabled={item.disabled || undefined}
                        onMouseMove={() => {
                          if (!item.disabled && itemIndex !== active) setActive(itemIndex);
                        }}
                        onClick={() => choose(item)}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm select-none",
                          "aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-selected:bg-bg-sunken",
                          "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-subtle",
                        )}
                      >
                        {item.icon}
                        <span className="grid min-w-0 flex-1">
                          <span className="truncate">{item.label}</span>
                          {item.description ? (
                            <span className="truncate text-xs text-fg-subtle">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                        {item.shortcut ? (
                          <kbd className="shrink-0 rounded-sm border border-border px-1.5 py-0.5 font-ui text-2xs text-fg-subtle">
                            {item.shortcut}
                          </kbd>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {flat.length === 0 ? (
            <p className="m-0 px-4 py-8 text-center text-sm text-fg-subtle" aria-hidden="true">
              {loading ? labels.loading : labels.empty}
            </p>
          ) : null}
          <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {open ? status : ""}
          </span>
          <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-border bg-bg-raised px-4 py-2 text-xs text-fg-subtle">
            {footer ?? (
              <>
                <span>
                  <Kbd>↑</Kbd> <Kbd>↓</Kbd> {labels.navigate}
                </span>
                <span>
                  <Kbd>↵</Kbd> {labels.select}
                </span>
                <span>
                  <Kbd>Esc</Kbd> {labels.close}
                </span>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-sm border border-border bg-bg px-1 py-px font-ui text-2xs text-fg-muted">
      {children}
    </kbd>
  );
}
