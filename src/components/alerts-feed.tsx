import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
import type { Tone } from "../lib/types";
import { ErrorState } from "./error-state";
import { Skeleton } from "./skeleton";

/** Nivel de alerta del tablero (contrato O1 §8). */
export type AlertLevel = "INFO" | "WARNING" | "CRITICAL";

export interface AlertsFeedItem {
  id: string;
  /** Nivel del contrato; decide el color del punto y el texto para lectores. */
  level?: AlertLevel;
  /** Tono propio (p. ej. "success" para un evento completado); tiene prioridad sobre `level`. */
  tone?: Tone;
  message: ReactNode;
  /** Fecha relativa o absoluta ("hace 12 min"). */
  time?: ReactNode;
  /** Contexto tras la fecha ("lote listo para emitir"). */
  meta?: ReactNode;
  /** Acción de la fila (botón o enlace pequeño). */
  action?: ReactNode;
}

export interface AlertsFeedLabels {
  levels?: Partial<Record<Tone, string>>;
  empty?: string;
  loading?: string;
}

const defaultLevelLabels: Record<Tone, string> = {
  neutral: "Evento",
  accent: "Destacado",
  info: "Información",
  success: "Completado",
  warning: "Aviso",
  danger: "Crítica",
};

const levelTone: Record<AlertLevel, Tone> = {
  INFO: "info",
  WARNING: "warning",
  CRITICAL: "danger",
};

const dotClasses: Record<Tone, string> = {
  neutral: "bg-fg-subtle",
  accent: "bg-accent",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export interface AlertsFeedProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  items: AlertsFeedItem[];
  /** Encabezado de la tarjeta ("Alertas"). */
  title?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  /** Acción del encabezado ("Ver todas"). */
  headerAction?: ReactNode;
  loading?: boolean;
  loadingRows?: number;
  /** Error de carga con reintento opcional. */
  error?: boolean | { title?: ReactNode; description?: ReactNode; onRetry?: () => void };
  /** Contenido cuando no hay alertas. */
  empty?: ReactNode;
  /** Anuncia las alertas nuevas con `aria-live` (role="log"). */
  live?: boolean;
  labels?: AlertsFeedLabels;
}

/**
 * Lista de alertas y eventos del tablero: punto de color por nivel (con su texto para lectores
 * de pantalla), mensaje, fecha y acción por fila. Estados de carga, vacío y error.
 */
export function AlertsFeed({
  items,
  title,
  headingLevel = 2,
  headerAction,
  loading = false,
  loadingRows = 3,
  error,
  empty,
  live = false,
  labels: labelsProp,
  className,
  ...props
}: AlertsFeedProps) {
  const levelLabels = { ...defaultLevelLabels, ...labelsProp?.levels };
  const Heading = `h${headingLevel}` as const;
  const errorProps = typeof error === "object" ? error : {};

  let body: ReactNode;
  if (loading) {
    body = (
      <div aria-busy="true" className="grid">
        <span className="sr-only" role="status">
          {labelsProp?.loading ?? "Cargando alertas…"}
        </span>
        {Array.from({ length: loadingRows }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-[8px_1fr] gap-3 border-b border-border py-3 last:border-b-0"
          >
            <Skeleton shape="circle" className="mt-1 size-2" />
            <div className="grid gap-1.5">
              <Skeleton className="w-[80%]" />
              <Skeleton className="h-3 w-[30%]" />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (error) {
    body = (
      <ErrorState
        bare
        headingLevel={headingLevel === 4 ? 4 : ((headingLevel + 1) as 3 | 4)}
        title={errorProps.title ?? "No se pudieron cargar las alertas"}
        description={errorProps.description}
        onRetry={errorProps.onRetry}
        className="py-8"
      />
    );
  } else if (items.length === 0) {
    body = empty ?? (
      <p className="m-0 py-6 text-center text-sm text-fg-subtle">
        {labelsProp?.empty ?? "Sin alertas pendientes."}
      </p>
    );
  } else {
    body = (
      <ul
        role={live ? "log" : undefined}
        aria-live={live ? "polite" : undefined}
        className="m-0 grid list-none p-0"
      >
        {items.map((item) => {
          const tone = item.tone ?? (item.level ? levelTone[item.level] : "neutral");
          return (
            <li
              key={item.id}
              className="grid grid-cols-[8px_minmax(0,1fr)_auto] items-start gap-3 border-b border-border py-2.5 last:border-b-0"
            >
              <span
                aria-hidden="true"
                className={cn("mt-1.5 size-2 rounded-full", dotClasses[tone])}
              />
              <div className="min-w-0 text-sm text-fg">
                <span className="sr-only">{levelLabels[tone]}: </span>
                {item.message}
                {item.time || item.meta ? (
                  <small className="block text-xs text-fg-subtle">
                    {item.time}
                    {item.time && item.meta ? " · " : null}
                    {item.meta}
                  </small>
                ) : null}
              </div>
              {item.action ? <div className="shrink-0">{item.action}</div> : <span />}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section className={cn("grid content-start gap-1.5 font-ui", className)} {...props}>
      {title || headerAction ? (
        <div className="flex items-center justify-between gap-3">
          {title ? (
            <Heading className="m-0 text-md font-semibold text-fg">{title}</Heading>
          ) : (
            <span />
          )}
          {headerAction}
        </div>
      ) : null}
      {body}
    </section>
  );
}
