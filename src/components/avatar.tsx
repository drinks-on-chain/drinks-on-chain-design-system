"use client";

import { Avatar as AvatarPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export interface AvatarProps extends Omit<ComponentProps<typeof AvatarPrimitive.Root>, "children"> {
  /** Nombre completo: da las iniciales y el texto alternativo. */
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "size-6 text-2xs", md: "size-8 text-xs", lg: "size-12 text-md" };

/** Iniciales a partir de un nombre ("Lucía Rojas" → "LR"). */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** Avatar circular con foto o iniciales en oro suave. */
export function Avatar({ name, src, size = "md", className, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft align-middle font-ui leading-none font-semibold text-accent-text select-none",
        sizes[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <AvatarPrimitive.Image src={src} alt={name} className="size-full object-cover" />
      ) : null}
      <AvatarPrimitive.Fallback delayMs={src ? 300 : 0} aria-label={name} role="img">
        {getInitials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
