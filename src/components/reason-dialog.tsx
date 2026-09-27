"use client";

import { useRef, useState, type ReactNode } from "react";
import { ConfirmFrame, useConfirmState, type ConfirmBaseProps } from "./alert-dialog-parts";
import { Field } from "./field";
import { Textarea } from "./input";

export interface ReasonDialogLabels {
  reason?: string;
  help?: (min: number, max: number) => string;
  counter?: (length: number, max: number) => string;
  tooShort?: (min: number) => string;
  tooLong?: (max: number) => string;
}

const defaultLabels: Required<ReasonDialogLabels> = {
  reason: "Motivo",
  help: (min, max) => `Entre ${min} y ${max} caracteres. Queda registrado en la bitácora.`,
  counter: (length, max) => `${length} / ${max}`,
  tooShort: (min) => `Escribe el motivo (mínimo ${min} caracteres).`,
  tooLong: (max) => `El motivo no puede superar ${max} caracteres.`,
};

/** Valida un motivo: `null` si es válido, o el tipo de error. Recorta los espacios. */
export function validateReason(
  reason: string,
  min = 3,
  max = 500,
): "too-short" | "too-long" | null {
  const length = reason.trim().length;
  if (length < min) return "too-short";
  if (length > max) return "too-long";
  return null;
}

export interface ReasonDialogProps extends ConfirmBaseProps {
  /**
   * Recibe el motivo recortado. Si devuelve una promesa, el diálogo espera, se cierra al
   * resolverse y muestra el mensaje del error si se rechaza.
   */
  onConfirm: (reason: string) => void | Promise<void>;
  /** Longitud mínima (contrato: 3). */
  minLength?: number;
  /** Longitud máxima (contrato: 500). */
  maxLength?: number;
  defaultReason?: string;
  placeholder?: string;
  /** Error del servidor para el campo (422 con `details[{ field: 'reason' }]`). */
  reasonError?: ReactNode;
  labels?: ReasonDialogLabels;
}

/**
 * Diálogo que pide un motivo obligatorio antes de una acción sobre terceros (AUD-05):
 * suspender, revocar, bloquear, cambiar un ajuste… El motivo va a la bitácora.
 */
export function ReasonDialog({
  onConfirm,
  minLength = 3,
  maxLength = 500,
  defaultReason = "",
  placeholder,
  reasonError,
  labels: labelsProp,
  open: openProp,
  defaultOpen,
  onOpenChange,
  errorLabel,
  children,
  ...props
}: ReasonDialogProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const [reason, setReason] = useState(defaultReason);
  const [touched, setTouched] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const state = useConfirmState({
    open: openProp,
    defaultOpen,
    onOpenChange: (next) => {
      if (!next) {
        setReason(defaultReason);
        setTouched(false);
      }
      onOpenChange?.(next);
    },
    errorLabel,
  });

  const problem = validateReason(reason, minLength, maxLength);
  const clientError =
    touched && problem === "too-short"
      ? labels.tooShort(minLength)
      : touched && problem === "too-long"
        ? labels.tooLong(maxLength)
        : null;
  const length = reason.trim().length;

  return (
    <ConfirmFrame
      {...props}
      open={state.open}
      onOpenChange={state.setOpen}
      busy={state.busy}
      error={state.error}
      initialFocusRef={textareaRef}
      onSubmit={() => {
        setTouched(true);
        if (problem) {
          textareaRef.current?.focus();
          return;
        }
        void state.run(() => onConfirm(reason.trim()));
      }}
    >
      {children}
      <Field
        label={labels.reason}
        required
        error={clientError ?? reasonError}
        help={
          <span className="flex justify-between gap-3">
            <span>{labels.help(minLength, maxLength)}</span>
            <span className="shrink-0 tabular-nums" aria-hidden="true">
              {labels.counter(length, maxLength)}
            </span>
          </span>
        }
      >
        <Textarea
          ref={textareaRef}
          value={reason}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={3}
          onChange={(event) => setReason(event.target.value)}
          onBlur={() => {
            if (reason.length > 0) setTouched(true);
          }}
        />
      </Field>
    </ConfirmFrame>
  );
}
