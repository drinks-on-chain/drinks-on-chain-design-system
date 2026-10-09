"use client";

import {
  CircleAlert,
  CircleCheck,
  Clock,
  LoaderCircle,
  RefreshCw,
  Send,
  type LucideIcon,
} from "lucide-react";
import { useState, type HTMLAttributes } from "react";
import type { Tone } from "../lib/types";
import { cn } from "../lib/utils";
import { Badge, type BadgeProps } from "./badge";
import { ExplorerLink } from "./explorer-link";

// Estado de una transacción en la red (contrato de la Ola 3, §2.3 y §2.4). El componente no
// depende de `@drinks-on-chain/mocks`: declara sus tipos, estructuralmente compatibles con
// `ChainTxRef`, de modo que `status`, `explorerUrl`, `lastError` y `attempts` se pasan tal cual.

/** `ChainTxStatus` del contrato. */
export type TxStatus = "PENDING" | "BUILDING" | "SUBMITTED" | "CONFIRMED" | "RETRYING" | "FAILED";

/** `ChainTxRef.lastError` del contrato. */
export interface TxStatusError {
  code: string;
  message: string;
  retryable: boolean;
}

type TxMotion = "spin" | "pulse" | null;

export interface TxStatusDefinition {
  label: string;
  tone: Tone;
  /** La transacción sigue su curso: conviene refrescarla por consulta. */
  inProgress: boolean;
}

interface InternalDefinition extends TxStatusDefinition {
  icon: LucideIcon;
  motion: TxMotion;
}

const definitions: Record<TxStatus, InternalDefinition> = {
  PENDING: { label: "En cola", tone: "neutral", icon: Clock, motion: null, inProgress: true },
  BUILDING: {
    label: "Preparando",
    tone: "info",
    icon: LoaderCircle,
    motion: "spin",
    inProgress: true,
  },
  SUBMITTED: {
    label: "Enviada a la red",
    tone: "info",
    icon: Send,
    motion: "pulse",
    inProgress: true,
  },
  CONFIRMED: {
    label: "Confirmada",
    tone: "success",
    icon: CircleCheck,
    motion: null,
    inProgress: false,
  },
  RETRYING: {
    label: "Reintentando",
    tone: "warning",
    icon: RefreshCw,
    motion: "spin",
    inProgress: true,
  },
  FAILED: { label: "Fallida", tone: "danger", icon: CircleAlert, motion: null, inProgress: false },
};

const unknownIcon: LucideIcon = Clock;

function isKnownStatus(status: string): status is TxStatus {
  return Object.hasOwn(definitions, status);
}

/**
 * Etiqueta y tono de un estado. Un estado desconocido (el backend añade uno nuevo) se muestra tal
 * cual en tono neutro en lugar de fallar.
 */
export function getTxStatus(status: TxStatus | (string & {})): TxStatusDefinition {
  if (!isKnownStatus(status)) return { label: status, tone: "neutral", inProgress: false };
  const { label, tone, inProgress } = definitions[status];
  return { label, tone, inProgress };
}

/** `true` de `PENDING` a `RETRYING`: mientras tanto la app refresca por consulta (§2.4). */
export function isTxInProgress(status: TxStatus | (string & {})): boolean {
  return getTxStatus(status).inProgress;
}

export interface TxStatusBadgeLabels {
  /** Etiqueta por estado; se fusiona con las del contrato. */
  status?: Partial<Record<TxStatus, string>>;
  /** Texto del enlace al explorador. */
  explorer?: string;
  /** Aviso para lectores de pantalla de que el enlace abre otra pestaña. */
  newTab?: string;
  /** Texto de los intentos (solo se muestra a partir del segundo). */
  attempts?: (attempts: number) => string;
  /** Prefijo del código de error. */
  errorCode?: string;
  /** Nota cuando una transacción fallida admite reintento. */
  retryable?: string;
  /** Anuncio para lectores de pantalla cuando cambia el estado. */
  statusChanged?: (label: string) => string;
}

const defaultLabels = {
  explorer: "Ver en el explorador",
  newTab: "(se abre en una pestaña nueva)",
  attempts: (attempts: number) => `Intento ${attempts}`,
  errorCode: "Código",
  retryable: "Se puede reintentar.",
  statusChanged: (label: string) => `Estado de la transacción: ${label}`,
};

export interface TxStatusBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** `ChainTxRef.status`. */
  status: TxStatus | (string & {});
  /** `ChainTxRef.explorerUrl`: URL completa que construye el backend. Añade el enlace externo. */
  explorerUrl?: string | null;
  /** `ChainTxRef.lastError`: se muestra como texto, no en un tooltip. */
  lastError?: TxStatusError | null;
  /** `ChainTxRef.attempts`: se muestra a partir del segundo intento. */
  attempts?: number | null;
  /** Sustituye la etiqueta del estado. */
  label?: string;
  size?: BadgeProps["size"];
  /** Anuncia los cambios de estado con una región `aria-live="polite"` (por defecto sí). */
  announce?: boolean;
  labels?: TxStatusBadgeLabels;
}

/**
 * Estado de una transacción en la red: icono, texto y tono (nunca solo el color), intentos, error
 * legible y enlace al explorador. Los cambios de estado se anuncian una vez, sin interrumpir; el
 * montaje inicial no se anuncia.
 */
export function TxStatusBadge({
  status,
  explorerUrl,
  lastError,
  attempts,
  label: labelProp,
  size,
  announce = true,
  labels: labelsProp,
  className,
  ...props
}: TxStatusBadgeProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const known = isKnownStatus(status);
  const definition = getTxStatus(status);
  const Icon = known ? definitions[status].icon : unknownIcon;
  const motion = known ? definitions[status].motion : null;
  const label = labelProp ?? (known ? labels.status?.[status] : undefined) ?? definition.label;
  const failed = status === "FAILED";

  // Estado derivado durante el render: el anuncio solo cambia cuando cambia `status`.
  const [previousStatus, setPreviousStatus] = useState(status);
  const [announcement, setAnnouncement] = useState("");
  if (previousStatus !== status) {
    setPreviousStatus(status);
    setAnnouncement(
      [labels.statusChanged(label), failed && lastError ? lastError.message : null]
        .filter(Boolean)
        .join(". "),
    );
  }

  return (
    <span
      data-status={status}
      className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-ui", className)}
      {...props}
    >
      <Badge tone={definition.tone} size={size} dot={false}>
        <Icon
          aria-hidden="true"
          className={cn(
            "size-3 shrink-0",
            motion === "spin" && "animate-spin motion-reduce:animate-none",
            motion === "pulse" && "animate-pulse motion-reduce:animate-none",
          )}
        />
        {label}
      </Badge>
      {typeof attempts === "number" && attempts > 1 ? (
        <span data-part="attempts" className="text-xs whitespace-nowrap text-fg-muted">
          {labels.attempts(attempts)}
        </span>
      ) : null}
      <ExplorerLink href={explorerUrl} newTabLabel={labels.newTab}>
        {labels.explorer}
      </ExplorerLink>
      {lastError ? (
        <span
          data-part="error"
          className={cn("basis-full text-xs", failed ? "text-danger-text" : "text-fg-muted")}
        >
          {lastError.message}{" "}
          <span className="whitespace-nowrap">
            ({labels.errorCode}: <code className="font-mono">{lastError.code}</code>)
          </span>
          {failed && lastError.retryable ? ` ${labels.retryable}` : null}
        </span>
      ) : null}
      {announce ? (
        <span className="sr-only" role="status" aria-live="polite">
          {announcement}
        </span>
      ) : null}
    </span>
  );
}
