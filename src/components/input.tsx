"use client";

import { cva } from "class-variance-authority";
import type { InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { fieldFocus } from "../lib/styles";
import { useFieldControl } from "./field";

const controlBase = [
  "relative w-full rounded-md border border-border-strong bg-bg-raised text-fg",
  "font-ui font-normal placeholder:text-fg-subtle",
  "transition-[border-color]",
  "aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-60",
  "focus:z-[1]",
  fieldFocus,
].join(" ");

export const inputVariants = cva([controlBase, "px-3 leading-tight"], {
  variants: {
    size: {
      sm: "min-h-8 text-sm",
      md: "min-h-10 text-md",
      lg: "min-h-14 text-lg",
    },
    numeric: { true: "text-right tabular-nums" },
    giant: {
      true: "min-h-28 bg-bg-sunken px-6 text-right text-5xl font-medium tracking-[0.02em] tabular-nums md:text-6xl",
    },
  },
  defaultVariants: { size: "md" },
});

const addonClasses = [
  "grid shrink-0 place-items-center border border-border-strong bg-bg-deep px-4",
  "font-ui text-sm font-medium whitespace-nowrap text-fg-muted",
].join(" ");

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: "sm" | "md" | "lg";
  /** Cifras alineadas a la derecha con tabular-nums; teclado decimal. */
  numeric?: boolean;
  /** Input de báscula: 48–64 px, fondo hundido (pantallas de planta). */
  giant?: boolean;
  /** Contenido antes del campo (p. ej. "Bs"). */
  prefix?: ReactNode;
  /** Contenido después del campo, típicamente la unidad ("kg", "L", "% vol"). */
  suffix?: ReactNode;
  /** Marca el campo como inválido (dentro de un Field con `error` es automático). */
  invalid?: boolean;
  /** Clases del contenedor cuando hay prefijo o sufijo. */
  wrapperClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

/** Campo de texto con variantes numérica y gigante, prefijo y sufijo. */
export function Input({
  size,
  numeric = false,
  giant = false,
  prefix,
  suffix,
  invalid,
  wrapperClassName,
  className,
  inputMode,
  ...props
}: InputProps) {
  const control = useFieldControl({ ...props, invalid });
  const input = (
    <input
      {...props}
      {...control}
      inputMode={inputMode ?? (numeric || giant ? "decimal" : undefined)}
      className={cn(
        inputVariants({ size, numeric, giant }),
        prefix != null && "rounded-l-none",
        suffix != null && "rounded-r-none",
        className,
      )}
    />
  );
  if (prefix == null && suffix == null) return input;
  return (
    <div className={cn("flex w-full items-stretch", wrapperClassName)}>
      {prefix != null ? (
        <span className={cn(addonClasses, "rounded-l-md border-r-0", giant && "text-2xl")}>
          {prefix}
        </span>
      ) : null}
      {input}
      {suffix != null ? (
        <span className={cn(addonClasses, "rounded-r-md border-l-0", giant && "text-2xl")}>
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

/** Área de texto redimensionable en vertical. */
export function Textarea({ invalid, className, ...props }: TextareaProps) {
  const control = useFieldControl({ ...props, invalid });
  return (
    <textarea
      {...props}
      {...control}
      className={cn(controlBase, "min-h-24 resize-y p-3 text-md leading-normal", className)}
    />
  );
}
