"use client";

import { useEffect, useRef } from "react";

// Atajos de teclado globales (05 §6: `/` buscar, ⌘K paleta, `Esc` cerrar).
//
// Formato: teclas separadas por "+", sin distinguir mayúsculas: "mod+k", "/", "escape",
// "shift+?", "ctrl+alt+p". `mod` es ⌘ en macOS y Ctrl en el resto; en la práctica acepta
// cualquiera de los dos, así Ctrl+K también funciona en un Mac con teclado externo.

interface ParsedHotkey {
  key: string;
  mod: boolean;
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
}

const aliases: Record<string, string> = {
  esc: "escape",
  return: "enter",
  space: " ",
  spacebar: " ",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
  del: "delete",
  cmd: "meta",
  command: "meta",
  control: "ctrl",
  option: "alt",
};

function parseHotkey(hotkey: string): ParsedHotkey {
  // "+" suelto es la tecla más ("mod++"): se separa por "+" salvo el último carácter.
  const raw = hotkey.trim().toLowerCase();
  const parts = raw.endsWith("++") ? [...raw.slice(0, -2).split("+"), "+"] : raw.split("+");
  const parsed: ParsedHotkey = {
    key: "",
    mod: false,
    ctrl: false,
    meta: false,
    alt: false,
    shift: false,
  };
  for (const part of parts) {
    const token = aliases[part] ?? part;
    if (token === "mod") parsed.mod = true;
    else if (token === "ctrl") parsed.ctrl = true;
    else if (token === "meta") parsed.meta = true;
    else if (token === "alt") parsed.alt = true;
    else if (token === "shift") parsed.shift = true;
    else parsed.key = token;
  }
  return parsed;
}

/** Indica si un evento de teclado corresponde al atajo (p. ej. "mod+k", "/", "escape"). */
export function matchesHotkey(
  event: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "altKey" | "shiftKey">,
  hotkey: string,
): boolean {
  const parsed = parseHotkey(hotkey);
  const key = (event.key ?? "").toLowerCase();
  if (key !== parsed.key) return false;
  if (parsed.mod) {
    if (!event.metaKey && !event.ctrlKey) return false;
  } else {
    if (event.ctrlKey !== parsed.ctrl) return false;
    if (event.metaKey !== parsed.meta) return false;
  }
  if (event.altKey !== parsed.alt) return false;
  // Los símbolos que exigen Mayús ("?", ":") no obligan a escribir "shift+" en el atajo.
  const symbol = parsed.key.length === 1 && !/[a-z0-9]/.test(parsed.key);
  if (!symbol && event.shiftKey !== parsed.shift) return false;
  return true;
}

/** El navegador corre en macOS o iOS (para mostrar ⌘ en lugar de Ctrl). */
export function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

const appleSymbols: Record<string, string> = {
  mod: "⌘",
  meta: "⌘",
  ctrl: "⌃",
  alt: "⌥",
  shift: "⇧",
};

const otherSymbols: Record<string, string> = {
  mod: "Ctrl",
  meta: "Win",
  ctrl: "Ctrl",
  alt: "Alt",
  shift: "Mayús",
};

const keyNames: Record<string, string> = {
  escape: "Esc",
  enter: "↵",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  " ": "Espacio",
  backspace: "⌫",
  delete: "Supr",
  tab: "Tab",
};

/**
 * Texto de un atajo para mostrarlo (`<kbd>`): "⌘K" en macOS y "Ctrl K" en el resto.
 * `apple` fuerza la plataforma (pruebas, historias).
 */
export function formatHotkey(hotkey: string, apple: boolean = isApplePlatform()): string {
  const parsed = parseHotkey(hotkey);
  const symbols = apple ? appleSymbols : otherSymbols;
  const modifiers: string[] = [];
  if (parsed.ctrl) modifiers.push(symbols.ctrl!);
  if (parsed.alt) modifiers.push(symbols.alt!);
  if (parsed.shift) modifiers.push(symbols.shift!);
  if (parsed.mod) modifiers.push(symbols.mod!);
  if (parsed.meta) modifiers.push(symbols.meta!);
  const key = keyNames[parsed.key] ?? parsed.key.toUpperCase();
  return apple ? [...modifiers, key].join("") : [...modifiers, key].join(" ");
}

/** El evento nace en un campo de texto (ahí `/` o las letras se escriben, no son atajos). */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target.tagName === "TEXTAREA" || target.tagName === "SELECT") return true;
  if (target.tagName !== "INPUT") return false;
  const type = (target as HTMLInputElement).type;
  return !["checkbox", "radio", "button", "submit", "reset", "range", "color", "file"].includes(
    type,
  );
}

export interface UseHotkeyOptions {
  /** Desactiva el atajo sin quitar el hook. */
  enabled?: boolean;
  /**
   * Se dispara también con el foco en un campo de texto. Por defecto solo lo hacen los atajos
   * con ⌘/Ctrl/Alt (p. ej. "mod+k"); `/` o una letra se escriben en el campo.
   */
  allowInInputs?: boolean;
  /** Llama a `preventDefault()` al dispararse (por defecto sí). */
  preventDefault?: boolean;
  /** Ignora eventos ya atendidos por otro manejador (`defaultPrevented`). Por defecto no. */
  ignoreHandled?: boolean;
  /** Fase del evento: "keydown" (por defecto) o "keyup". */
  event?: "keydown" | "keyup";
}

/**
 * Registra uno o varios atajos de teclado en `window`.
 *
 * ```tsx
 * useHotkey("mod+k", () => setOpen(true));
 * useHotkey(["/", "mod+f"], focusSearch);
 * ```
 */
export function useHotkey(
  hotkey: string | readonly string[],
  handler: (event: KeyboardEvent) => void,
  options: UseHotkeyOptions = {},
): void {
  const {
    enabled = true,
    allowInInputs,
    preventDefault = true,
    ignoreHandled = false,
    event: eventName = "keydown",
  } = options;
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });
  const keys = typeof hotkey === "string" ? hotkey : hotkey.join("\u0000");

  useEffect(() => {
    if (!enabled) return;
    const list = keys.split("\u0000").filter(Boolean);
    const listener = (event: KeyboardEvent) => {
      if (ignoreHandled && event.defaultPrevented) return;
      const match = list.find((candidate) => matchesHotkey(event, candidate));
      if (!match) return;
      const parsed = parseHotkey(match);
      const withModifier = parsed.mod || parsed.ctrl || parsed.meta || parsed.alt;
      const inInputsAllowed = allowInInputs ?? withModifier;
      if (!inInputsAllowed && isTypingTarget(event.target)) return;
      if (preventDefault) event.preventDefault();
      handlerRef.current(event);
    };
    window.addEventListener(eventName, listener);
    return () => window.removeEventListener(eventName, listener);
  }, [keys, enabled, allowInInputs, preventDefault, ignoreHandled, eventName]);
}
