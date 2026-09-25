import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface KeyValueItem {
  term: ReactNode;
  value: ReactNode;
  key?: string;
}

export interface KeyValueListProps extends HTMLAttributes<HTMLDListElement> {
  items: KeyValueItem[];
  /** "stacked" pone el término encima del valor (móvil, columnas estrechas). */
  layout?: "inline" | "stacked";
}

/** Lista de término y valor (`<dl>`) para fichas de detalle. */
export function KeyValueList({ items, layout = "inline", className, ...props }: KeyValueListProps) {
  return (
    <dl
      className={cn(
        "m-0 font-ui text-sm",
        layout === "inline" ? "grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2" : "grid gap-3",
        className,
      )}
      {...props}
    >
      {items.map((item, index) =>
        layout === "inline" ? (
          <div key={item.key ?? index} className="contents">
            <dt className="text-fg-subtle">{item.term}</dt>
            <dd className="m-0 font-medium text-fg">{item.value}</dd>
          </div>
        ) : (
          <div key={item.key ?? index} className="grid gap-0.5">
            <dt className="text-xs text-fg-subtle">{item.term}</dt>
            <dd className="m-0 font-medium text-fg">{item.value}</dd>
          </div>
        ),
      )}
    </dl>
  );
}
