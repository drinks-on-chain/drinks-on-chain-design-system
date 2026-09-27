"use client";

import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { fieldFocus } from "../lib/styles";
import { useCopy } from "../lib/use-copy";
import { Button } from "./button";
import { IconButton } from "./icon-button";

export interface CopyFieldLabels {
  copy?: string;
  copied?: string;
  copyError?: string;
  reveal?: string;
  hide?: string;
}

const defaultLabels: Required<CopyFieldLabels> = {
  copy: "Copiar",
  copied: "Copiado",
  copyError: "No se pudo copiar",
  reveal: "Mostrar",
  hide: "Ocultar",
};

export interface CopyFieldProps {
  value: string;
  /** Etiqueta visible; sin ella, usa `aria-label`. */
  label?: ReactNode;
  "aria-label"?: string;
  /** Ayuda bajo el campo. */
  help?: ReactNode;
  /** Oculta el valor con puntos hasta pulsar "Mostrar" (secretos). */
  masked?: boolean;
  /** Texto a copiar si difiere del mostrado (p. ej. sin los espacios de agrupación). */
  copyValue?: string;
  /** Tipografía monoespaciada (por defecto sí). */
  mono?: boolean;
  size?: "sm" | "md";
  onCopy?: () => void;
  labels?: CopyFieldLabels;
  className?: string;
}

/**
 * Valor de solo lectura con botón Copiar (secreto TOTP, enlace de invitación, hash). El aviso
 * "Copiado" se anuncia con `aria-live`. Con `masked` el valor no está en el DOM hasta mostrarlo.
 */
export function CopyField({
  value,
  label,
  "aria-label": ariaLabel,
  help,
  masked = false,
  copyValue,
  mono = true,
  size = "md",
  onCopy,
  labels: labelsProp,
  className,
}: CopyFieldProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const id = useId();
  const helpId = help ? `${id}-help` : undefined;
  const [revealed, setRevealed] = useState(!masked);
  const { copy, status } = useCopy();
  const shown = revealed ? value : "•".repeat(Math.min(Math.max(value.length, 8), 32));

  return (
    <div className={cn("grid content-start gap-1 font-ui", className)}>
      {label ? (
        <label htmlFor={id} className="text-sm leading-[1.3] font-medium text-fg">
          {label}
        </label>
      ) : null}
      <div className="flex items-stretch gap-2">
        <input
          id={id}
          readOnly
          value={shown}
          aria-label={label ? undefined : ariaLabel}
          aria-describedby={helpId}
          onFocus={(event) => {
            if (revealed) event.currentTarget.select();
          }}
          className={cn(
            "min-w-0 flex-1 rounded-md border border-border-strong bg-bg-sunken px-3 text-fg",
            mono ? "font-mono tracking-[0.04em]" : "font-ui",
            size === "sm" ? "min-h-8 text-sm" : "min-h-10 text-md",
            fieldFocus,
          )}
        />
        {masked ? (
          <IconButton
            variant="outline"
            size={size === "sm" ? "sm" : "md"}
            label={revealed ? labels.hide : labels.reveal}
            aria-pressed={revealed}
            onClick={() => setRevealed((current) => !current)}
          >
            {revealed ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
          </IconButton>
        ) : null}
        <Button
          variant="secondary"
          size={size === "sm" ? "sm" : "md"}
          iconStart={status === "copied" ? <Check aria-hidden /> : <Copy aria-hidden />}
          onClick={async () => {
            if (await copy(copyValue ?? value)) onCopy?.();
          }}
        >
          {status === "copied" ? labels.copied : labels.copy}
        </Button>
      </div>
      {help ? (
        <p id={helpId} className="m-0 text-xs text-fg-subtle">
          {help}
        </p>
      ) : null}
      <span className="sr-only" role="status" aria-live="polite">
        {status === "copied" ? labels.copied : status === "error" ? labels.copyError : ""}
      </span>
    </div>
  );
}
