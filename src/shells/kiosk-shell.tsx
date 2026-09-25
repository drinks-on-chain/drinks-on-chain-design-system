"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";
import type { ThemeName } from "../lib/types";

export interface KioskShellProps {
  /** Sucursal y mostrador ("Licorería La Cava · Tarija"). */
  branch: ReactNode;
  /** Contexto adicional a la izquierda (cajero, turno). */
  context?: ReactNode;
  /** Estado de la conexión; cambia el punto y el texto (anunciado con aria-live). */
  online?: boolean;
  /** Reloj: `true` muestra la hora actual; un nodo lo sustituye; `false` lo oculta. */
  clock?: boolean | ReactNode;
  /** Botón secundario abajo (uno por pantalla). */
  footer?: ReactNode;
  /** Tema; el POS usa Cava Reserva. */
  theme?: ThemeName;
  labels?: { online?: string; offline?: string };
  className?: string;
  /** Clases del área principal (el contenido ocupa todo el alto disponible). */
  contentClassName?: string;
  children?: ReactNode;
}

function Clock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("es", { hour: "2-digit", minute: "2-digit" });
    const update = () => setTime(format.format(new Date()));
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);
  return time ? <time className="tabular-nums">{time}</time> : null;
}

/**
 * Shell del POS en modo kiosco: pantalla completa en Cava Reserva, barra de estado
 * fina (sucursal, conexión, hora), una acción por pantalla y un botón secundario abajo.
 */
export function KioskShell({
  branch,
  context,
  online = true,
  clock = true,
  footer,
  theme = "cava",
  labels,
  className,
  contentClassName,
  children,
}: KioskShellProps) {
  return (
    <div
      data-theme={theme}
      className={cn("flex min-h-dvh flex-col bg-bg font-ui text-lg text-fg select-none", className)}
    >
      <header className="flex h-9 shrink-0 items-center justify-between gap-4 border-b border-border px-6 text-sm font-medium text-fg-subtle">
        <span className="truncate">
          {branch}
          {context ? <> · {context}</> : null}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span role="status" aria-live="polite" className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-full", online ? "bg-success" : "bg-warning")}
            />
            {online ? (labels?.online ?? "En línea") : (labels?.offline ?? "Sin conexión")}
          </span>
          {clock === false ? null : (
            <>
              <span aria-hidden="true">·</span>
              {clock === true ? <Clock /> : clock}
            </>
          )}
        </span>
      </header>
      <main className={cn("relative grid min-h-0 flex-1", contentClassName)}>{children}</main>
      {footer ? <footer className="flex shrink-0 justify-center px-6 pb-6">{footer}</footer> : null}
    </div>
  );
}
