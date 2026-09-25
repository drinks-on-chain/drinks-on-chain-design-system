"use client";

import { createContext, useContext, useId, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";

interface FieldContextValue {
  id: string;
  labelId: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Contexto del Field más cercano (para conectar controles propios). */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

interface FieldControlInput {
  id?: string | undefined;
  "aria-describedby"?: string | undefined;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling" | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;
}

/**
 * Props de accesibilidad de un control dentro de un Field: id, aria-describedby,
 * aria-invalid, required y disabled. Las props explícitas tienen prioridad.
 */
export function useFieldControl(props: FieldControlInput = {}) {
  const field = useContext(FieldContext);
  const describedBy =
    [field?.describedBy, props["aria-describedby"]].filter(Boolean).join(" ") || undefined;
  const invalid =
    props.invalid ??
    (props["aria-invalid"] === true || props["aria-invalid"] === "true" || field?.invalid === true);
  // Si el control trae su propio id, la etiqueta del Field lo nombra con aria-labelledby.
  const ownId = props.id !== undefined && field !== null && props.id !== field.id;
  return {
    id: props.id ?? field?.id,
    "aria-labelledby": ownId ? field.labelId : undefined,
    "aria-describedby": describedBy,
    "aria-invalid": invalid || undefined,
    required: props.required ?? (field?.required || undefined),
    disabled: props.disabled ?? (field?.disabled || undefined),
  };
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: ReactNode;
  /** Ayuda bajo el control. */
  help?: ReactNode;
  /** Mensaje de error: marca el control con aria-invalid y lo describe. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Id del control; si se omite se genera. */
  htmlFor?: string;
  /** Oculta la etiqueta visualmente (sigue disponible para lectores). */
  hideLabel?: boolean;
  children: ReactNode;
}

/**
 * Etiqueta encima, control, ayuda y error debajo. Conecta automáticamente
 * Input, Textarea, Select y RadioGroup (id, aria-describedby, aria-invalid, required).
 */
export function Field({
  label,
  help,
  error,
  required = false,
  disabled = false,
  htmlFor,
  hideLabel = false,
  className,
  children,
  ...props
}: FieldProps) {
  const generated = useId();
  const id = htmlFor ?? `field-${generated}`;
  const labelId = `${id}-label`;
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(" ") || undefined;
  const invalid = Boolean(error);

  return (
    <FieldContext.Provider value={{ id, labelId, describedBy, invalid, required, disabled }}>
      <div className={cn("grid content-start gap-1", className)} {...props}>
        <label
          id={labelId}
          htmlFor={id}
          className={cn(
            "font-ui text-sm leading-[1.3] font-medium text-fg",
            disabled && "opacity-60",
            hideLabel && "sr-only",
          )}
        >
          {label}
          {/* El control lleva `required`; el asterisco es solo visual */}
          {required ? (
            <span aria-hidden="true" className="ml-0.5 text-danger">
              *
            </span>
          ) : null}
        </label>
        {children}
        {help ? (
          <p id={helpId} className="m-0 text-xs text-fg-subtle">
            {help}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="m-0 text-xs text-danger-text">
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
