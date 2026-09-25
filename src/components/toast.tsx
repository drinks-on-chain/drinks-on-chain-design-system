"use client";

import { Toast as ToastPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { useSyncExternalStore, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import type { Tone } from "../lib/types";

export type ToastTone = Extract<Tone, "neutral" | "success" | "danger" | "warning" | "info">;

const dotClasses: Record<ToastTone, string> = {
  neutral: "bg-accent",
  success: "bg-green-300",
  danger: "bg-red-300",
  warning: "bg-amber-300",
  info: "bg-blue-300",
};

const toastSurface =
  "flex items-start gap-3 rounded-md bg-fg px-4 py-3 font-ui text-sm text-bg shadow-overlay";

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  action?: ReactNode;
}

/**
 * Aspecto de una notificación (tinta invertida con punto de estado). Para mostrarlas
 * de verdad usa `toast()` con un `<Toaster />` montado una vez en la app.
 */
export function Toast({
  title,
  description,
  tone = "neutral",
  action,
  className,
  ...props
}: ToastProps) {
  return (
    <div className={cn(toastSurface, "inline-flex", className)} {...props}>
      <ToastBody title={title} description={description} tone={tone} />
      {action}
    </div>
  );
}

function ToastBody({
  title,
  description,
  tone,
}: {
  title: ReactNode;
  description?: ReactNode;
  tone: ToastTone;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn("mt-1.5 size-2 shrink-0 rounded-full", dotClasses[tone])}
      />
      <div className="grid min-w-0 flex-1 gap-0.5">
        <span className="font-medium">{title}</span>
        {description ? <span className="text-xs opacity-80">{description}</span> : null}
      </div>
    </>
  );
}

/* ---------- Cola de notificaciones ---------- */

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Duración en ms (por defecto la del Toaster). */
  duration?: number;
  action?: { label: string; onClick: () => void; altText?: string };
  id?: string;
}

interface ToastRecord extends ToastOptions {
  id: string;
  open: boolean;
}

let records: ToastRecord[] = [];
const listeners = new Set<() => void>();
let counter = 0;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Muestra una notificación. Devuelve su id. */
export function toast(options: ToastOptions): string {
  const id = options.id ?? `toast-${++counter}`;
  records = [...records.filter((record) => record.id !== id), { ...options, id, open: true }];
  emit();
  return id;
}

/** Cierra una notificación (o todas sin id). */
toast.dismiss = (id?: string) => {
  records = records.map((record) =>
    id === undefined || record.id === id ? { ...record, open: false } : record,
  );
  emit();
  // Deja terminar la animación de salida antes de desmontar.
  setTimeout(() => {
    records = records.filter((record) => record.open);
    emit();
  }, 400);
};

const emptyRecords: ToastRecord[] = [];

export interface ToasterProps {
  /** Duración por defecto en ms. */
  duration?: number;
  /** Etiqueta de la región para lectores ("Notificaciones"). */
  label?: string;
  closeLabel?: string;
  className?: string;
}

/**
 * Región de notificaciones (Radix Toast, aria-live). Móntala una vez cerca de la raíz
 * y llama a `toast({ title })` desde cualquier parte.
 */
export function Toaster({
  duration = 5000,
  label = "Notificaciones",
  closeLabel = "Cerrar",
  className,
}: ToasterProps) {
  const items = useSyncExternalStore(
    subscribe,
    () => records,
    () => emptyRecords,
  );
  return (
    <ToastPrimitive.Provider duration={duration} label={label} swipeDirection="right">
      {items.map((item) => (
        <ToastPrimitive.Root
          key={item.id}
          open={item.open}
          duration={item.duration}
          type={item.tone === "danger" ? "foreground" : "background"}
          onOpenChange={(open) => {
            if (!open) toast.dismiss(item.id);
          }}
          className={cn(
            toastSurface,
            "w-full",
            "data-[state=closed]:animate-fade-out data-[state=open]:animate-slide-in-right motion-reduce:animate-none",
            "data-[swipe=end]:animate-slide-out-right data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "mt-1.5 size-2 shrink-0 rounded-full",
              dotClasses[item.tone ?? "neutral"],
            )}
          />
          <div className="grid min-w-0 flex-1 gap-0.5">
            <ToastPrimitive.Title className="font-medium">{item.title}</ToastPrimitive.Title>
            {item.description ? (
              <ToastPrimitive.Description className="text-xs opacity-80">
                {item.description}
              </ToastPrimitive.Description>
            ) : null}
          </div>
          {item.action ? (
            <ToastPrimitive.Action
              altText={item.action.altText ?? item.action.label}
              onClick={item.action.onClick}
              className={cn(
                "shrink-0 cursor-pointer self-center rounded-sm px-1 text-sm font-medium text-accent underline-offset-[3px] hover:underline",
                focusRing,
              )}
            >
              {item.action.label}
            </ToastPrimitive.Action>
          ) : null}
          <ToastPrimitive.Close
            aria-label={closeLabel}
            className={cn(
              "shrink-0 cursor-pointer rounded-sm opacity-70 hover:opacity-100",
              focusRing,
            )}
          >
            <X className="size-4" aria-hidden />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport
        className={cn(
          "fixed right-0 bottom-0 z-toast m-0 flex w-full max-w-[420px] list-none flex-col gap-2 p-4 outline-none",
          "pb-[max(1rem,env(safe-area-inset-bottom))]",
          className,
        )}
      />
    </ToastPrimitive.Provider>
  );
}
