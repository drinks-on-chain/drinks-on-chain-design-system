"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { inputVariants } from "./input";
import { Pill, PillGroup } from "./pill";

/** Rango de fechas en formato ISO `YYYY-MM-DD` (el de los filtros `from` / `to` de la API). */
export interface DateRange {
  from: string | null;
  to: string | null;
}

export type DateRangeError =
  "from-required" | "to-required" | "from-after-to" | "before-min" | "after-max" | "too-long";

export interface DateRangeRules {
  min?: string;
  max?: string;
  /** Exige las dos fechas. */
  required?: boolean;
  /** Días máximos del rango (inclusive). */
  maxDays?: number;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function toUtc(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year!, (month ?? 1) - 1, day ?? 1);
}

/** Días del rango, contando ambos extremos. */
export function daysInRange(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / 86_400_000) + 1;
}

/** Valida un rango: `null` si es válido, o el primer error encontrado. */
export function validateDateRange(
  range: DateRange,
  rules: DateRangeRules = {},
): DateRangeError | null {
  const from = range.from && ISO_DATE.test(range.from) ? range.from : null;
  const to = range.to && ISO_DATE.test(range.to) ? range.to : null;
  if (rules.required && !from) return "from-required";
  if (rules.required && !to) return "to-required";
  if (rules.min && ((from && from < rules.min) || (to && to < rules.min))) return "before-min";
  if (rules.max && ((from && from > rules.max) || (to && to > rules.max))) return "after-max";
  if (from && to && from > to) return "from-after-to";
  if (from && to && rules.maxDays && daysInRange(from, to) > rules.maxDays) return "too-long";
  return null;
}

/** Fecha local en `YYYY-MM-DD` (sin pasar por UTC). */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Los últimos `days` días hasta hoy, inclusive (preajustes "7 días", "30 días"). */
export function lastDaysRange(days: number, today: Date = new Date()): DateRange {
  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1));
  return { from: toIsoDate(start), to: toIsoDate(today) };
}

export interface DateRangePreset {
  label: string;
  range: DateRange;
}

export interface DateRangePickerLabels {
  from?: string;
  to?: string;
  presets?: string;
  errors?: Partial<Record<DateRangeError, string>>;
}

const defaultErrors: Record<DateRangeError, string> = {
  "from-required": "Indica la fecha de inicio.",
  "to-required": "Indica la fecha de fin.",
  "from-after-to": "La fecha de inicio debe ser anterior o igual a la de fin.",
  "before-min": "Hay una fecha anterior a la mínima permitida.",
  "after-max": "Hay una fecha posterior a la máxima permitida.",
  "too-long": "El rango es demasiado largo.",
};

export interface DateRangePickerProps extends DateRangeRules {
  /** Nombre del grupo (leyenda del fieldset). */
  label: ReactNode;
  hideLabel?: boolean;
  value?: DateRange;
  defaultValue?: DateRange;
  /** Recibe el rango y su error de validación (o `null`). */
  onValueChange?: (range: DateRange, error: DateRangeError | null) => void;
  /** Preajustes (p. ej. `lastDaysRange(7)`), como pills. */
  presets?: DateRangePreset[];
  help?: ReactNode;
  /** Error externo (servidor); tiene prioridad sobre la validación. */
  error?: ReactNode;
  disabled?: boolean;
  size?: "sm" | "md";
  /** Nombres de los campos para formularios. */
  nameFrom?: string;
  nameTo?: string;
  labels?: DateRangePickerLabels;
  className?: string;
}

/**
 * Rango de dos fechas con validación (inicio ≤ fin, mínimo, máximo, duración máxima) sobre los
 * campos de fecha nativos: teclado y selector del sistema, sin dependencias.
 */
export function DateRangePicker({
  label,
  hideLabel = false,
  value: valueProp,
  defaultValue = { from: null, to: null },
  onValueChange,
  presets,
  help,
  error: errorProp,
  disabled = false,
  size = "sm",
  min,
  max,
  required,
  maxDays,
  nameFrom,
  nameTo,
  labels,
  className,
}: DateRangePickerProps) {
  const id = useId();
  const [valueState, setValueState] = useState<DateRange>(defaultValue);
  const value = valueProp ?? valueState;
  const [touched, setTouched] = useState(false);
  const rules = { min, max, required, maxDays };
  const problem = validateDateRange(value, rules);
  // Los "falta la fecha" solo se muestran tras tocar los campos.
  const visibleProblem =
    problem && (touched || (problem !== "from-required" && problem !== "to-required"))
      ? problem
      : null;
  const errorText =
    errorProp ??
    (visibleProblem ? (labels?.errors?.[visibleProblem] ?? defaultErrors[visibleProblem]) : null);
  const helpId = help ? `${id}-help` : undefined;
  const errorId = errorText ? `${id}-error` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(" ") || undefined;
  const invalid = Boolean(errorText) || undefined;

  const update = (next: DateRange) => {
    if (valueProp === undefined) setValueState(next);
    onValueChange?.(next, validateDateRange(next, rules));
  };

  const inputClass = cn(inputVariants({ size }), "w-auto min-w-36 tabular-nums");
  const activePreset = presets?.find(
    (preset) => preset.range.from === value.from && preset.range.to === value.to,
  );

  return (
    <fieldset
      disabled={disabled}
      className={cn("m-0 grid min-w-0 content-start gap-1 border-0 p-0 font-ui", className)}
    >
      <legend
        className={cn(
          "mb-1 p-0 text-sm leading-[1.3] font-medium text-fg",
          disabled && "opacity-60",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </legend>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-xs text-fg-muted">
          <span>{labels?.from ?? "Desde"}</span>
          <input
            type="date"
            name={nameFrom}
            value={value.from ?? ""}
            min={min}
            max={value.to ?? max}
            required={required}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            onChange={(event) => update({ ...value, from: event.target.value || null })}
            onBlur={() => setTouched(true)}
            className={inputClass}
          />
        </label>
        <span aria-hidden="true" className="text-fg-subtle">
          –
        </span>
        <label className="flex items-center gap-2 text-xs text-fg-muted">
          <span>{labels?.to ?? "Hasta"}</span>
          <input
            type="date"
            name={nameTo}
            value={value.to ?? ""}
            min={value.from ?? min}
            max={max}
            required={required}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            onChange={(event) => update({ ...value, to: event.target.value || null })}
            onBlur={() => setTouched(true)}
            className={inputClass}
          />
        </label>
        {presets?.length ? (
          <PillGroup label={labels?.presets ?? "Periodos"} className="gap-1.5">
            {presets.map((preset) => (
              <Pill
                key={preset.label}
                size="sm"
                pressed={preset === activePreset}
                onPressedChange={() => update(preset.range)}
              >
                {preset.label}
              </Pill>
            ))}
          </PillGroup>
        ) : null}
      </div>
      {help ? (
        <p id={helpId} className="m-0 text-xs text-fg-subtle">
          {help}
        </p>
      ) : null}
      {errorText ? (
        <p id={errorId} role="alert" className="m-0 text-xs text-danger-text">
          {errorText}
        </p>
      ) : null}
    </fieldset>
  );
}
