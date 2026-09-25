"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import type { ThemeName } from "../lib/types";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const useIsomorphicLayoutEffect = typeof window === "undefined" ? () => {} : useLayoutEffect;

export interface ThemeProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Tema controlado. */
  theme?: ThemeName;
  /** Tema inicial si no se controla. Por defecto "oro". */
  defaultTheme?: ThemeName;
  onThemeChange?: (theme: ThemeName) => void;
  /**
   * "document" (por defecto) escribe `data-theme` en `<html>`;
   * "element" envuelve a los hijos en un `<div data-theme>` con fondo y texto del tema.
   */
  scope?: "document" | "element";
  children?: ReactNode;
}

/**
 * Aplica el tema (Oro Líquido / Cava Reserva) mediante `data-theme`.
 * Para un tema fijo en Next.js basta con `<html data-theme="cava">` en el layout.
 */
export function ThemeProvider({
  theme: themeProp,
  defaultTheme = "oro",
  onThemeChange,
  scope = "document",
  className,
  children,
  ...props
}: ThemeProviderProps) {
  const [uncontrolled, setUncontrolled] = useState<ThemeName>(defaultTheme);
  const theme = themeProp ?? uncontrolled;

  const setTheme = useCallback(
    (next: ThemeName) => {
      if (themeProp === undefined) setUncontrolled(next);
      onThemeChange?.(next);
    },
    [themeProp, onThemeChange],
  );

  useIsomorphicLayoutEffect(() => {
    if (scope !== "document") return;
    const html = document.documentElement;
    const previous = html.getAttribute("data-theme");
    html.setAttribute("data-theme", theme);
    return () => {
      if (previous === null) html.removeAttribute("data-theme");
      else html.setAttribute("data-theme", previous);
    };
  }, [scope, theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {scope === "element" ? (
        <div data-theme={theme} className={cn("bg-bg text-fg", className)} {...props}>
          {children}
        </div>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
}

/** Tema actual y cambio de tema. Fuera de un ThemeProvider devuelve "oro". */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext) ?? { theme: "oro", setTheme: () => {} };
}
