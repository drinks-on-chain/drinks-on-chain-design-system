"use client";

import { Check, Copy } from "lucide-react";
import type { ClipboardEvent, HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { useCopy } from "../lib/use-copy";
import { ExplorerLink } from "./explorer-link";
import { IconButton } from "./icon-button";

/** Tipo de identificador de la red: cuenta `G…`, contrato `C…` (StrKey de 56) o hash hex de 64. */
export type ChainAddressKind = "account" | "contract" | "hash" | "unknown";

/** Reconoce la forma del identificador (no valida la suma de comprobación del StrKey). */
export function getChainAddressKind(value: string): ChainAddressKind {
  if (/^G[A-Z2-7]{55}$/.test(value)) return "account";
  if (/^C[A-Z2-7]{55}$/.test(value)) return "contract";
  if (/^[0-9a-f]{64}$/i.test(value)) return "hash";
  return "unknown";
}

/** Trunca por el medio: `GDN3CA…4SB6`. Si el valor ya es corto, lo devuelve entero. */
export function truncateMiddle(value: string, head = 6, tail = 4): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${tail > 0 ? value.slice(-tail) : ""}`;
}

export interface ChainAddressLabels {
  /** Nombre del botón de copiar una cuenta o un contrato. */
  copyAddress?: string;
  /** Nombre del botón de copiar un hash. */
  copyHash?: string;
  copied?: string;
  copyError?: string;
  explorer?: string;
  newTab?: string;
}

const defaultLabels: Required<ChainAddressLabels> = {
  copyAddress: "Copiar dirección",
  copyHash: "Copiar hash",
  copied: "Copiado",
  copyError: "No se pudo copiar",
  explorer: "Ver en el explorador",
  newTab: "(se abre en una pestaña nueva)",
};

export interface ChainAddressProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children" | "onCopy"
> {
  /** Dirección StrKey de 56 caracteres (`G…` / `C…`) o hash de transacción (64 en hex). */
  value: string;
  /** Qué es, para lectores de pantalla (p. ej. «Cuenta de la bodega»). */
  label?: string;
  /** Truncar por el medio (por defecto sí). Con `false` se muestra entera y parte de línea. */
  truncate?: boolean;
  /** Caracteres visibles al principio y al final al truncar (por defecto 6 y 4). */
  head?: number;
  tail?: number;
  /** Botón de copiar (por defecto sí). */
  copyable?: boolean;
  /** URL completa del explorador que devuelve el backend; añade un enlace externo de icono. */
  explorerUrl?: string | null;
  size?: "sm" | "md";
  /** Se llama cuando el valor completo llegó al portapapeles con el botón. */
  onCopy?: () => void;
  labels?: ChainAddressLabels;
}

/**
 * Dirección o hash de la red en monoespaciada, truncada por el medio. La versión completa la leen
 * los lectores de pantalla y es la que llega al portapapeles, tanto con el botón (patrón de
 * `CopyField`: `useCopy` y aviso con `aria-live`) como al seleccionar el texto y copiar.
 */
export function ChainAddress({
  value,
  label,
  truncate = true,
  head = 6,
  tail = 4,
  copyable = true,
  explorerUrl,
  size = "md",
  onCopy,
  labels: labelsProp,
  className,
  ...props
}: ChainAddressProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const { copy, status } = useCopy();
  const kind = getChainAddressKind(value);
  const short = truncate ? truncateMiddle(value, head, tail) : value;
  const truncated = short !== value;
  const copyLabel = kind === "hash" ? labels.copyHash : labels.copyAddress;

  const copyFullValue = (event: ClipboardEvent<HTMLSpanElement>) => {
    event.clipboardData.setData("text/plain", value);
    event.preventDefault();
  };

  return (
    <span
      data-kind={kind}
      className={cn("inline-flex max-w-full items-center gap-1 align-middle", className)}
      {...props}
    >
      <span
        data-part="value"
        onCopy={copyFullValue}
        className={cn(
          "min-w-0 font-mono tracking-[0.02em] text-fg",
          size === "sm" ? "text-xs" : "text-sm",
          truncated ? "whitespace-nowrap" : "break-all",
        )}
      >
        {label ? <span className="sr-only">{label}: </span> : null}
        {truncated ? (
          <>
            <span aria-hidden="true" title={value}>
              {short}
            </span>
            <span className="sr-only">{value}</span>
          </>
        ) : (
          value
        )}
      </span>
      {copyable ? (
        <IconButton
          size="sm"
          label={`${copyLabel} ${short}`}
          onClick={async () => {
            if (await copy(value)) onCopy?.();
          }}
        >
          {status === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </IconButton>
      ) : null}
      <ExplorerLink href={explorerUrl} iconOnly newTabLabel={labels.newTab}>
        {`${labels.explorer} ${short}`}
      </ExplorerLink>
      {copyable ? (
        <span className="sr-only" role="status" aria-live="polite">
          {status === "copied" ? labels.copied : status === "error" ? labels.copyError : ""}
        </span>
      ) : null}
    </span>
  );
}
