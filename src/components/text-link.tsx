"use client";

import { Slot } from "radix-ui";
import type { AnchorHTMLAttributes, Ref } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * "editorial": Cormorant espaciada con subrayado que se dibuja al pasar (landings, Marketplace).
   * "inline": enlace dentro de un texto, en oro para texto (AA).
   */
  variant?: "editorial" | "inline";
  /** Marca el enlace como actual (aria-current) y lo pinta en oro. */
  current?: boolean;
  /** Renderiza el hijo (p. ej. `next/link`) con los estilos del enlace. */
  asChild?: boolean;
  ref?: Ref<HTMLAnchorElement>;
}

/** Enlace de texto. */
export function TextLink({
  variant = "editorial",
  current = false,
  asChild = false,
  className,
  ...props
}: TextLinkProps) {
  const Component = asChild ? Slot.Root : "a";
  return (
    <Component
      aria-current={current ? "page" : undefined}
      className={cn(
        "rounded-sm",
        variant === "editorial" &&
          [
            "relative inline-block font-display tracking-[0.1em] text-inherit no-underline",
            "after:block after:h-px after:origin-left after:scale-x-0 after:bg-current after:content-['']",
            "after:transition-transform after:duration-(--doc-dur-reveal) after:ease-out",
            "hover:after:scale-x-100 aria-[current=page]:text-accent-text aria-[current=page]:after:scale-x-100",
          ].join(" "),
        variant === "inline" &&
          "text-accent-text underline decoration-1 underline-offset-[3px] hover:decoration-2 aria-[current=page]:font-medium",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}
