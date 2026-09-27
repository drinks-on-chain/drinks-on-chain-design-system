"use client";

import { useState, type InputHTMLAttributes, type Ref } from "react";
import { cn } from "../lib/utils";
import { useFieldContext, useFieldControl } from "./field";

export interface OtpInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "size" | "maxLength" | "type"
> {
  /** Número de caracteres (TOTP: 6). */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Se llama al completar todos los caracteres (tecleados, pegados o autocompletados). */
  onComplete?: (code: string) => void;
  /** "numeric" (por defecto) o "alphanumeric" (en mayúsculas). */
  mode?: "numeric" | "alphanumeric";
  invalid?: boolean;
  size?: "md" | "lg";
  ref?: Ref<HTMLInputElement>;
}

/** Deja solo los caracteres válidos y recorta a `length`. "123 456" → "123456". */
export function sanitizeOtp(
  value: string,
  length = 6,
  mode: "numeric" | "alphanumeric" = "numeric",
): string {
  const clean =
    mode === "numeric" ? value.replace(/\D/g, "") : value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return clean.slice(0, length);
}

/**
 * Código de un solo uso (TOTP) en casillas. Es un único campo real: el lector de pantalla lo
 * lee como un texto, pegar un código completo lo reparte, el cursor avanza solo y el sistema
 * puede autocompletarlo (`autocomplete="one-time-code"`).
 */
export function OtpInput({
  length = 6,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onComplete,
  mode = "numeric",
  invalid,
  size = "md",
  disabled,
  className,
  onFocus,
  onBlur,
  "aria-label": ariaLabel,
  ...props
}: OtpInputProps) {
  const field = useFieldContext();
  const control = useFieldControl({ ...props, disabled, invalid });
  const [valueState, setValueState] = useState(() => sanitizeOtp(defaultValue, length, mode));
  const value = valueProp !== undefined ? sanitizeOtp(valueProp, length, mode) : valueState;
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, length - 1);

  const update = (raw: string) => {
    const next = sanitizeOtp(raw, length, mode);
    if (next === value) return;
    if (valueProp === undefined) setValueState(next);
    onValueChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const keepCaretAtEnd = (input: HTMLInputElement) => {
    const end = input.value.length;
    if (input.selectionStart !== end || input.selectionEnd !== end) {
      input.setSelectionRange(end, end);
    }
  };

  return (
    <div
      className={cn(
        "relative inline-flex gap-2 font-ui",
        control.disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {Array.from({ length }, (_, index) => {
        const char = value[index];
        const active = focused && index === activeIndex;
        return (
          <div
            key={index}
            aria-hidden="true"
            data-active={active || undefined}
            data-filled={char !== undefined || undefined}
            className={cn(
              "relative grid place-items-center rounded-md border border-border-strong bg-bg-raised font-medium text-fg tabular-nums",
              "transition-[border-color]",
              "data-active:border-accent data-active:outline-2 data-active:outline-offset-1 data-active:outline-focus",
              control["aria-invalid"] && "border-danger",
              size === "lg" ? "h-16 w-13 text-3xl" : "h-12 w-10 text-2xl",
            )}
          >
            {char ?? ""}
            {active && char === undefined ? (
              <span className="absolute h-6 w-px animate-pulse bg-fg motion-reduce:animate-none" />
            ) : null}
          </div>
        );
      })}
      <input
        {...props}
        {...control}
        aria-label={ariaLabel ?? (field ? undefined : "Código de verificación")}
        type="text"
        inputMode={mode === "numeric" ? "numeric" : "text"}
        pattern={mode === "numeric" ? "[0-9]*" : "[A-Za-z0-9]*"}
        autoComplete="one-time-code"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(event) => update(event.target.value)}
        onFocus={(event) => {
          setFocused(true);
          keepCaretAtEnd(event.currentTarget);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onSelect={(event) => keepCaretAtEnd(event.currentTarget)}
        className="absolute inset-0 size-full cursor-text border-0 bg-transparent text-transparent caret-transparent opacity-0 outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}
