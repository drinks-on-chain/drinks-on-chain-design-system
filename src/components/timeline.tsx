import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface TimelineItem {
  title: ReactNode;
  /** Fecha o estado temporal bajo el título. */
  time?: ReactNode;
  description?: ReactNode;
  status?: "done" | "current" | "pending";
  key?: string;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
}

/** Línea de tiempo vertical (trazabilidad del lote, candados, viaje del producto). */
export function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <ol className={cn("m-0 grid list-none p-0 font-ui text-sm", className)} {...props}>
      {items.map((item, index) => {
        const status = item.status ?? "pending";
        const last = index === items.length - 1;
        return (
          <li
            key={item.key ?? index}
            aria-current={status === "current" ? "step" : undefined}
            className="relative pb-4 pl-6 last:pb-0"
          >
            {last ? null : (
              <span
                aria-hidden="true"
                className="absolute top-2 -bottom-1 left-[5px] w-px bg-border-strong"
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1 left-0 size-[11px] rounded-full border-2",
                status === "done" && "border-fg bg-fg",
                status === "current" && "border-accent bg-accent",
                status === "pending" && "border-border-strong bg-bg",
              )}
            />
            <span className={cn("block", status === "pending" ? "text-fg-muted" : "text-fg")}>
              {item.title}
            </span>
            {item.time ? <span className="block text-xs text-fg-subtle">{item.time}</span> : null}
            {item.description ? (
              <span className="mt-1 block text-xs text-fg-muted">{item.description}</span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
