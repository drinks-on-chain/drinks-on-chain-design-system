"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import { Check, ChevronDown, X } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import { matchesQuery } from "../lib/text";
import { useFieldContext, useFieldControl } from "./field";
import { Spinner } from "./spinner";

export interface ComboboxOption {
  value: string;
  /** Texto de la opción; también es lo que se escribe en el campo al elegirla. */
  label: string;
  /** Línea secundaria (NIT, región, correo). */
  description?: ReactNode;
  /** Agrupa las opciones bajo un encabezado. */
  group?: string;
  /** Palabras extra para la búsqueda. */
  keywords?: string[];
  disabled?: boolean;
}

export interface ComboboxLabels {
  empty?: string;
  loading?: string;
  error?: string;
  clear?: string;
  toggle?: string;
  remove?: (label: string) => string;
  results?: (count: number) => string;
  /** Mensaje cuando la consulta es más corta que `minQueryLength`. */
  typeToSearch?: string;
}

const defaultLabels: Required<ComboboxLabels> = {
  empty: "Sin resultados",
  loading: "Buscando…",
  error: "No se pudieron cargar las opciones",
  clear: "Borrar selección",
  toggle: "Mostrar opciones",
  remove: (label) => `Quitar ${label}`,
  results: (count) => (count === 1 ? "1 resultado" : `${count} resultados`),
  typeToSearch: "Escribe para buscar",
};

interface ComboboxBaseProps {
  /** Opciones en cliente. Con `loadOptions` se ignoran salvo para conocer etiquetas. */
  options?: ComboboxOption[];
  /** Búsqueda asíncrona (servidor). Recibe la consulta y una señal para cancelar. */
  loadOptions?: (query: string, signal: AbortSignal) => Promise<ComboboxOption[]>;
  /** Espera tras la última tecla antes de llamar a `loadOptions` (ms). */
  debounceMs?: number;
  /** Longitud mínima de la consulta para buscar en el servidor. */
  minQueryLength?: number;
  /**
   * Filtro en cliente. Por defecto busca todas las palabras en la etiqueta y `keywords`
   * (sin tildes); `false` desactiva el filtro (la app filtra con `onQueryChange`).
   */
  filter?: ((option: ComboboxOption, query: string) => boolean) | false;
  /** Informa de cada cambio del texto escrito. */
  onQueryChange?: (query: string) => void;
  /** Carga externa (la app busca con `onQueryChange` y actualiza `options`). */
  loading?: boolean;
  /** Opciones ya elegidas que no están en `options` (búsqueda asíncrona), para sus etiquetas. */
  selectedOptions?: ComboboxOption[];
  placeholder?: string;
  size?: "sm" | "md";
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  /** Nombre para formularios: se añade un input oculto por valor. */
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  labels?: ComboboxLabels;
  className?: string;
  contentClassName?: string;
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, option: ComboboxOption | null) => void;
  /** Muestra el botón para borrar la selección. */
  clearable?: boolean;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], options: ComboboxOption[]) => void;
  clearable?: boolean;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

const defaultFilter = (option: ComboboxOption, query: string) =>
  matchesQuery(query, option.label, ...(option.keywords ?? []));

/**
 * Campo de búsqueda con lista de opciones (patrón combobox de WAI-ARIA): filtra al escribir,
 * se maneja con flechas, Enter y Esc, admite búsqueda asíncrona y selección simple o múltiple.
 * El panel usa el Popover de Radix, así que funciona dentro de Modal y SlideOver.
 */
export function Combobox(props: ComboboxProps) {
  const {
    options = [],
    loadOptions,
    debounceMs = 250,
    minQueryLength = 0,
    filter,
    onQueryChange,
    loading: loadingProp = false,
    selectedOptions = [],
    placeholder,
    size = "md",
    invalid,
    disabled,
    required,
    id,
    name,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    labels: labelsProp,
    className,
    contentClassName,
    clearable = false,
  } = props;
  const multiple = props.multiple === true;
  const labels = { ...defaultLabels, ...labelsProp };
  const field = useFieldContext();
  const control = useFieldControl({
    id,
    invalid,
    required,
    disabled,
    "aria-describedby": ariaDescribedBy,
  });
  const generated = useId();
  const baseId = control.id ?? `combobox-${generated}`;
  const listId = `${baseId}-listbox`;

  // ---------- valor ----------
  const initial: string[] = multiple
    ? ((props as ComboboxMultipleProps).defaultValue ?? [])
    : (props as ComboboxSingleProps).defaultValue != null
      ? [(props as ComboboxSingleProps).defaultValue as string]
      : [];
  const [valueState, setValueState] = useState<string[]>(initial);
  const controlled = props.value !== undefined;
  const values: string[] = controlled
    ? multiple
      ? ((props.value as string[] | undefined) ?? [])
      : props.value == null
        ? []
        : [props.value as string]
    : valueState;

  // ---------- consulta y panel ----------
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState(false);
  const [activeState, setActiveIndex] = useState(-1);
  const [asyncResult, setAsyncResult] = useState<{
    query: string;
    options: ComboboxOption[];
    error: boolean;
  } | null>(null);
  // Opciones elegidas de resultados asíncronos: conservan su etiqueta al cambiar la búsqueda.
  const [picked, setPicked] = useState<Record<string, ComboboxOption>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef(loadOptions);
  useEffect(() => {
    loadRef.current = loadOptions;
  });

  const searchQuery = (typed ? query : "").trim();
  const isAsync = Boolean(loadOptions);
  const belowMinimum = isAsync && searchQuery.length < minQueryLength;
  const asyncOptions = useMemo(
    () => (belowMinimum ? [] : (asyncResult?.options ?? [])),
    [belowMinimum, asyncResult],
  );

  // Etiquetas conocidas de cada valor (elegidas, `selectedOptions`, opciones y resultados).
  const known = useMemo(() => {
    const map = new Map<string, ComboboxOption>();
    for (const option of [
      ...Object.values(picked),
      ...selectedOptions,
      ...options,
      ...asyncOptions,
    ])
      map.set(option.value, option);
    return map;
  }, [picked, selectedOptions, options, asyncOptions]);
  const optionFor = (value: string): ComboboxOption => known.get(value) ?? { value, label: value };

  useEffect(() => {
    if (!isAsync || !open || belowMinimum) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      const load = loadRef.current;
      if (!load) return;
      load(searchQuery, controller.signal).then(
        (result) => {
          if (!controller.signal.aborted)
            setAsyncResult({ query: searchQuery, options: result, error: false });
        },
        () => {
          if (!controller.signal.aborted)
            setAsyncResult({ query: searchQuery, options: [], error: true });
        },
      );
    }, debounceMs);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [isAsync, open, searchQuery, belowMinimum, debounceMs]);

  const asyncLoading = isAsync && open && !belowMinimum && asyncResult?.query !== searchQuery;
  const asyncError = isAsync && !asyncLoading && asyncResult?.error === true;

  const visible = useMemo(() => {
    if (isAsync) return asyncOptions;
    const active = filter === undefined ? defaultFilter : filter;
    if (!active || !searchQuery) return options;
    return options.filter((option) => active(option, searchQuery));
  }, [isAsync, asyncOptions, options, filter, searchQuery]);

  const loading = loadingProp || asyncLoading;
  const enabledIndexes = visible.flatMap((option, index) => (option.disabled ? [] : [index]));
  // Índice activo siempre dentro de los resultados visibles (cambian al escribir o al cargar).
  const activeIndex = !open
    ? -1
    : enabledIndexes.includes(activeState)
      ? activeState
      : (enabledIndexes[0] ?? -1);

  // ---------- acciones ----------
  const commit = (next: string[]) => {
    if (!controlled) setValueState(next);
    if (multiple) {
      (props as ComboboxMultipleProps).onValueChange?.(next, next.map(optionFor));
    } else {
      const value = next[0] ?? null;
      (props as ComboboxSingleProps).onValueChange?.(value, value ? optionFor(value) : null);
    }
  };

  const resetQuery = () => {
    setQuery("");
    setTyped(false);
    onQueryChange?.("");
  };

  const openPanel = (index?: number) => {
    if (control.disabled) return;
    setOpen(true);
    if (index !== undefined) setActiveIndex(index);
    else {
      const selectedIndex = visible.findIndex((option) => values.includes(option.value));
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : (enabledIndexes[0] ?? -1));
    }
  };

  const closePanel = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const select = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (isAsync) setPicked((current) => ({ ...current, [option.value]: option }));
    if (multiple) {
      const next = values.includes(option.value)
        ? values.filter((value) => value !== option.value)
        : [...values, option.value];
      commit(next);
      if (typed) resetQuery();
    } else {
      commit([option.value]);
      resetQuery();
      closePanel();
    }
  };

  const remove = (value: string) => {
    commit(values.filter((candidate) => candidate !== value));
    inputRef.current?.focus();
  };

  const clear = () => {
    commit([]);
    resetQuery();
    inputRef.current?.focus();
  };

  const move = (direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return;
    const position = enabledIndexes.indexOf(activeIndex);
    const next =
      position === -1
        ? direction === 1
          ? 0
          : enabledIndexes.length - 1
        : (position + direction + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[next]!);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openPanel();
        else move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openPanel(enabledIndexes[enabledIndexes.length - 1] ?? -1);
        else move(-1);
        break;
      case "Enter": {
        if (!open) return;
        event.preventDefault();
        const option = visible[activeIndex];
        if (option) select(option);
        break;
      }
      case "Escape":
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          closePanel();
          if (!multiple) resetQuery();
        } else if (typed || query) {
          event.preventDefault();
          event.stopPropagation();
          resetQuery();
        }
        break;
      case "Tab":
        if (open) closePanel();
        if (!multiple && typed) resetQuery();
        break;
      case "Backspace":
        if (multiple && query === "" && values.length > 0) {
          commit(values.slice(0, -1));
        }
        break;
      default:
    }
  };

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document.getElementById(`${baseId}-option-${activeIndex}`)?.scrollIntoView({
      block: "nearest",
    });
  }, [open, activeIndex, baseId]);

  const selectedLabel = !multiple && values[0] ? optionFor(values[0]).label : "";
  const inputValue = typed ? query : multiple ? "" : selectedLabel;
  const activeId =
    open && activeIndex >= 0 && visible[activeIndex]
      ? `${baseId}-option-${activeIndex}`
      : undefined;

  const status = !open
    ? ""
    : loading
      ? labels.loading
      : asyncError
        ? labels.error
        : belowMinimum
          ? labels.typeToSearch
          : visible.length === 0
            ? labels.empty
            : labels.results(visible.length);

  // Grupos en el orden de aparición.
  const groups: { name: string | undefined; items: { option: ComboboxOption; index: number }[] }[] =
    [];
  visible.forEach((option, index) => {
    const last = groups[groups.length - 1];
    if (last && last.name === option.group) last.items.push({ option, index });
    else {
      const existing = groups.find((group) => group.name === option.group);
      if (existing) existing.items.push({ option, index });
      else groups.push({ name: option.group, items: [{ option, index }] });
    }
  });

  const renderOption = ({ option, index }: { option: ComboboxOption; index: number }) => {
    const selected = values.includes(option.value);
    return (
      <div
        key={option.value}
        id={`${baseId}-option-${index}`}
        role="option"
        aria-selected={selected}
        aria-disabled={option.disabled || undefined}
        data-active={index === activeIndex || undefined}
        onMouseMove={() => {
          if (!option.disabled && index !== activeIndex) setActiveIndex(index);
        }}
        onClick={() => select(option)}
        className={cn(
          "relative flex cursor-pointer items-start gap-2 rounded-sm py-2 pr-3 pl-8 text-sm select-none",
          "aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-active:bg-bg-sunken",
          size === "sm" && "py-1.5",
        )}
      >
        <span className="absolute top-2 left-2 inline-flex size-4 items-center justify-center text-accent-text">
          {selected ? <Check className="size-4" aria-hidden /> : null}
        </span>
        <span className="grid min-w-0 gap-0.5">
          <span className={cn("truncate", selected && "font-medium")}>{option.label}</span>
          {option.description ? (
            <span className="truncate text-xs text-fg-subtle">{option.description}</span>
          ) : null}
        </span>
      </div>
    );
  };

  const hasValue = values.length > 0;

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closePanel();
      }}
    >
      <PopoverPrimitive.Anchor asChild>
        <div
          ref={anchorRef}
          onMouseDown={(event) => {
            // Un clic en el marco (no en el campo ni en un botón) enfoca el campo.
            if (event.target === event.currentTarget) {
              event.preventDefault();
              inputRef.current?.focus();
            }
          }}
          className={cn(
            "relative flex w-full cursor-text flex-wrap items-center gap-1 rounded-md border border-border-strong bg-bg-raised pr-1 pl-2 font-ui text-fg",
            "transition-[border-color] focus-within:border-accent focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-focus",
            control["aria-invalid"] && "border-danger",
            control.disabled && "cursor-not-allowed opacity-60",
            size === "sm" ? "min-h-8 py-0.5 text-sm" : "min-h-10 py-1 text-md",
            className,
          )}
        >
          {multiple
            ? values.map((value) => {
                const option = optionFor(value);
                return (
                  <span
                    key={value}
                    className="inline-flex h-6 max-w-full items-center gap-1 rounded-sm border border-border bg-bg pl-2 text-xs text-fg"
                  >
                    <span className="truncate">{option.label}</span>
                    <button
                      type="button"
                      aria-label={labels.remove(option.label)}
                      disabled={control.disabled}
                      onClick={() => remove(value)}
                      className={cn(
                        "inline-grid size-5 cursor-pointer place-items-center rounded-sm text-fg-subtle hover:text-fg",
                        focusRing,
                      )}
                    >
                      <X className="size-3" aria-hidden />
                    </button>
                  </span>
                );
              })
            : null}
          <input
            ref={inputRef}
            id={baseId}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={activeId}
            aria-label={ariaLabel}
            aria-labelledby={control["aria-labelledby"]}
            aria-describedby={control["aria-describedby"]}
            aria-invalid={control["aria-invalid"]}
            aria-required={control.required}
            disabled={control.disabled}
            placeholder={multiple && hasValue ? undefined : placeholder}
            value={inputValue}
            onChange={(event) => {
              setQuery(event.target.value);
              setTyped(true);
              onQueryChange?.(event.target.value);
              if (!open) setOpen(true);
            }}
            onKeyDown={onKeyDown}
            onClick={() => (open ? undefined : openPanel())}
            onBlur={(event) => {
              const next = event.relatedTarget as Node | null;
              if (next && (anchorRef.current?.contains(next) || contentRef.current?.contains(next)))
                return;
              closePanel();
              if (typed) resetQuery();
            }}
            className="h-7 min-w-16 flex-1 border-0 bg-transparent px-1 text-inherit outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed"
          />
          {clearable && hasValue && !control.disabled ? (
            <button
              type="button"
              aria-label={labels.clear}
              onClick={clear}
              className={cn(
                "inline-grid size-7 shrink-0 cursor-pointer place-items-center rounded-sm text-fg-subtle hover:text-fg",
                focusRing,
              )}
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
          {loading ? <Spinner size="sm" decorative className="mx-1.5 shrink-0" /> : null}
          <button
            type="button"
            tabIndex={-1}
            aria-label={labels.toggle}
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            disabled={control.disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (open) closePanel();
              else openPanel();
              inputRef.current?.focus();
            }}
            className="inline-grid size-7 shrink-0 cursor-pointer place-items-center rounded-sm text-fg-subtle hover:text-fg disabled:cursor-not-allowed"
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform motion-reduce:transition-none",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {name
            ? values.map((value) => <input key={value} type="hidden" name={name} value={value} />)
            : null}
        </div>
      </PopoverPrimitive.Anchor>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </span>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={contentRef}
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            if (anchorRef.current?.contains(event.target as Node)) event.preventDefault();
          }}
          className={cn(
            "z-popover max-h-72 w-(--radix-popover-trigger-width) min-w-48 overflow-auto rounded-md border border-border bg-bg p-1 font-ui text-fg shadow-overlay outline-none",
            "data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in motion-reduce:animate-none",
            contentClassName,
          )}
        >
          <div
            id={listId}
            role="listbox"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel ? undefined : field?.labelId}
            aria-multiselectable={multiple || undefined}
            onMouseDown={(event) => event.preventDefault()}
          >
            {groups.map((group, groupIndex) =>
              group.name ? (
                <div
                  key={group.name}
                  role="group"
                  aria-labelledby={`${baseId}-group-${groupIndex}`}
                >
                  <div
                    id={`${baseId}-group-${groupIndex}`}
                    role="presentation"
                    className="px-2 pt-2 pb-1 text-2xs font-medium tracking-label text-fg-subtle uppercase"
                  >
                    {group.name}
                  </div>
                  {group.items.map(renderOption)}
                </div>
              ) : (
                group.items.map(renderOption)
              ),
            )}
          </div>
          {visible.length === 0 || asyncError ? (
            <p className="m-0 px-3 py-2 text-sm text-fg-subtle" aria-hidden="true">
              {loading ? labels.loading : status}
            </p>
          ) : null}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
