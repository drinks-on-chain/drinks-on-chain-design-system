"use client";

import { useId, useRef, useState } from "react";
import { ConfirmFrame, useConfirmState, type ConfirmBaseProps } from "./alert-dialog-parts";
import { Field } from "./field";
import { Input } from "./input";

export interface ConfirmDialogProps extends ConfirmBaseProps {
  /**
   * Acción al confirmar. Si devuelve una promesa, el botón queda en carga, el diálogo se
   * cierra al resolverse y muestra el mensaje del error si se rechaza.
   */
  onConfirm: () => void | Promise<void>;
  /**
   * Confirmación escrita: el botón se activa solo al escribir este texto exacto (el
   * identificador del recurso en acciones destructivas: 03-backoffice «Reglas»).
   */
  confirmationText?: string;
  /** Etiqueta del campo de confirmación escrita. */
  confirmationLabel?: (text: string) => string;
}

/**
 * Diálogo de confirmación (role="alertdialog"): pregunta, consecuencia y dos botones.
 * `destructive` lo marca en rojo; `confirmationText` exige escribir el identificador.
 */
export function ConfirmDialog({
  onConfirm,
  confirmationText,
  confirmationLabel = (text) => `Escribe «${text}» para confirmar`,
  open: openProp,
  defaultOpen,
  onOpenChange,
  errorLabel,
  children,
  ...props
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");
  const state = useConfirmState({
    open: openProp,
    defaultOpen,
    onOpenChange: (next) => {
      if (!next) setTyped("");
      onOpenChange?.(next);
    },
    errorLabel,
  });
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = confirmationText === undefined || typed.trim() === confirmationText;

  return (
    <ConfirmFrame
      {...props}
      open={state.open}
      onOpenChange={state.setOpen}
      busy={state.busy}
      error={state.error}
      confirmDisabled={!matches}
      initialFocusRef={confirmationText !== undefined ? inputRef : undefined}
      onSubmit={() => {
        if (matches) void state.run(onConfirm);
      }}
    >
      {children}
      {confirmationText !== undefined ? (
        <Field label={confirmationLabel(confirmationText)} htmlFor={inputId}>
          <Input
            ref={inputRef}
            size="sm"
            autoComplete="off"
            spellCheck={false}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
          />
        </Field>
      ) : null}
    </ConfirmFrame>
  );
}
