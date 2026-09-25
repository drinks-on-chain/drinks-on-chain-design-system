import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type TagProps = HTMLAttributes<HTMLSpanElement>;

/** Etiqueta descriptiva con hairline (cepa, tipo, categoría). No indica estado. */
export function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-sm border border-border px-2.5 font-ui text-xs leading-none whitespace-nowrap text-fg-muted",
        className,
      )}
      {...props}
    />
  );
}
