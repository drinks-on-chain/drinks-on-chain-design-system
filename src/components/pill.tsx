"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";

export interface PillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Filtro activo (aria-pressed). */
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: "sm" | "md";
  ref?: Ref<HTMLButtonElement>;
}

/** Filtro con estado pulsado. Agrúpalos con PillGroup. */
export function Pill({
  pressed = false,
  onPressedChange,
  size = "md",
  onClick,
  type,
  className,
  ...props
}: PillProps) {
  return (
    <button
      type={type ?? "button"}
      aria-pressed={pressed}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onPressedChange?.(!pressed);
      }}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border-strong bg-transparent font-ui leading-none font-medium whitespace-nowrap text-fg-muted",
        "transition-[background-color,color,border-color] hover:text-fg",
        "aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "md" ? "h-8 px-3.5 text-sm" : "h-7 px-3 text-xs",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

export interface PillGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Nombre accesible del grupo de filtros. */
  label?: string;
}

/** Contenedor de filtros con role="group". */
export function PillGroup({ label, className, ...props }: PillGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
    />
  );
}
