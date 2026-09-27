"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyStatus = "idle" | "copied" | "error";

/** Copia texto al portapapeles. Devuelve `false` si el navegador no lo permite. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Sin permiso o contexto no seguro: se intenta el método antiguo.
  }
  if (typeof document === "undefined") return false;
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok: boolean;
  try {
    ok = document.execCommand?.("copy") ?? false;
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

/**
 * Estado de una acción "Copiar": `copy(text)` y `status` ("copied" o "error"), que vuelve a
 * "idle" pasado `resetMs`.
 */
export function useCopy(resetMs = 2000) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(
    async (text: string) => {
      const ok = await copyText(text);
      setStatus(ok ? "copied" : "error");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus("idle"), resetMs);
      return ok;
    },
    [resetMs],
  );
  return { copy, status };
}
