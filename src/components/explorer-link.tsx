"use client";

import { ExternalLink } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../lib/utils";
import { TextLink } from "./text-link";

/** Solo `http(s)`: una URL con otro esquema (`javascript:`, `data:`…) no se enlaza. */
export function isHttpUrl(value: string | null | undefined): value is string {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

export interface ExplorerLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel"
> {
  /**
   * URL completa que devuelve el backend (`explorerUrl`). Las apps nunca construyen el host del
   * explorador. Si falta o no es `http(s)`, no se renderiza nada.
   */
  href: string | null | undefined;
  /** Texto del enlace (por defecto «Ver en el explorador»). */
  children?: ReactNode;
  /** Solo el icono; el texto queda para lectores de pantalla (tablas y listas densas). */
  iconOnly?: boolean;
  /** Aviso para lectores de pantalla de que abre otra pestaña. */
  newTabLabel?: string;
  ref?: Ref<HTMLAnchorElement>;
}

/**
 * Enlace externo al explorador de la red: abre en otra pestaña con `rel="noopener noreferrer"` y
 * lo avisa a los lectores de pantalla.
 */
export function ExplorerLink({
  href,
  children = "Ver en el explorador",
  iconOnly = false,
  newTabLabel = "(se abre en una pestaña nueva)",
  className,
  ...props
}: ExplorerLinkProps) {
  if (!isHttpUrl(href)) return null;
  return (
    <TextLink
      variant="inline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 font-ui text-xs whitespace-nowrap",
        iconOnly && "min-h-6 min-w-6 justify-center",
        className,
      )}
      {...props}
    >
      {iconOnly ? <span className="sr-only">{children}</span> : <span>{children}</span>}
      <ExternalLink aria-hidden="true" className={iconOnly ? "size-4" : "size-3"} />
      {/* Espacio como nodo de texto: separa el aviso del texto en el nombre accesible. */}{" "}
      <span className="sr-only">{newTabLabel}</span>
    </TextLink>
  );
}
