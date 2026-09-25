"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export interface CountdownParts {
  /** Milisegundos restantes (0 si ya pasó). */
  remaining: number;
  days: number;
  hours: number;
  /** Días redondeados hacia arriba (para "faltan N días"). */
  daysCeil: number;
  complete: boolean;
}

/** Calcula días y horas que faltan hasta `target`. */
export function getCountdownParts(
  target: Date | string | number,
  now: Date | number = Date.now(),
): CountdownParts {
  const remaining = Math.max(0, new Date(target).getTime() - new Date(now).getTime());
  return {
    remaining,
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    daysCeil: Math.ceil(remaining / DAY),
    complete: remaining === 0,
  };
}

export interface CountdownLabels {
  day?: (n: number) => string;
  hour?: (n: number) => string;
  /** Frase accesible con días y horas. */
  remaining?: (days: number, hours: number) => string;
  /** Frase accesible solo con días. */
  remainingDays?: (days: number) => string;
  complete?: string;
}

const defaultLabels: Required<CountdownLabels> = {
  day: (n) => (n === 1 ? "día" : "días"),
  hour: (n) => (n === 1 ? "hora" : "horas"),
  remaining: (days, hours) =>
    `Faltan ${days} ${days === 1 ? "día" : "días"} y ${hours} ${hours === 1 ? "hora" : "horas"}`,
  remainingDays: (days) => `Faltan ${days} ${days === 1 ? "día" : "días"}`,
  complete: "Plazo cumplido",
};

export interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Fecha objetivo (Date, ISO o epoch en ms). */
  target: Date | string | number;
  /** Hora actual fija (SSR, pruebas, historias). Si se omite se usa el reloj y se actualiza. */
  now?: Date | number;
  /** "days-hours" muestra días y horas; "days" solo días (redondeados hacia arriba). */
  format?: "days-hours" | "days";
  /** "display": cifra grande en Cormorant (candados); "inline": texto corrido. */
  variant?: "display" | "inline";
  tone?: "neutral" | "warning" | "accent";
  /** Intervalo de actualización en ms (por defecto cada minuto). */
  tickMs?: number;
  onComplete?: () => void;
  labels?: CountdownLabels;
}

const toneClasses = {
  neutral: "text-fg",
  warning: "text-warning-text",
  accent: "text-accent-text",
};

/** Cuenta regresiva en días y horas hasta una fecha (candados de reposo, caducidad del pase). */
export function Countdown({
  target,
  now,
  format = "days-hours",
  variant = "display",
  tone = "neutral",
  tickMs = 60_000,
  onComplete,
  labels: labelsProp,
  className,
  ...props
}: CountdownProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const [clock, setClock] = useState(() => Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    if (now !== undefined) return;
    const id = setInterval(() => setClock(Date.now()), tickMs);
    return () => clearInterval(id);
  }, [now, tickMs]);

  const parts = getCountdownParts(target, now ?? clock);

  useEffect(() => {
    if (parts.complete && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
    if (!parts.complete) completedRef.current = false;
  }, [parts.complete, onComplete]);

  const days = format === "days" ? parts.daysCeil : parts.days;
  const accessible = parts.complete
    ? labels.complete
    : format === "days"
      ? labels.remainingDays(days)
      : labels.remaining(parts.days, parts.hours);
  const iso = new Date(target).toISOString();

  return (
    <div
      role="timer"
      aria-label={accessible}
      className={cn(
        "font-ui",
        variant === "display" ? "inline-flex items-baseline gap-2" : "inline",
        className,
      )}
      {...props}
    >
      <time dateTime={iso} aria-hidden="true" suppressHydrationWarning>
        {parts.complete ? (
          <span className={cn("font-medium", toneClasses[tone])}>{labels.complete}</span>
        ) : variant === "display" ? (
          <>
            <span
              className={cn(
                "font-display text-5xl leading-none font-medium lining-nums tabular-nums",
                toneClasses[tone],
              )}
            >
              {days}
            </span>
            <span className="ml-2 text-sm text-fg-muted">
              {labels.day(days)}
              {format === "days-hours" ? ` · ${parts.hours} ${labels.hour(parts.hours)}` : null}
            </span>
          </>
        ) : (
          <span className={cn("tabular-nums", toneClasses[tone])}>
            {days} {labels.day(days)}
            {format === "days-hours" ? ` · ${parts.hours} ${labels.hour(parts.hours)}` : null}
          </span>
        )}
      </time>
    </div>
  );
}
