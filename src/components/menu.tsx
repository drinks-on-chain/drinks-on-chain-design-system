"use client";

import { DropdownMenu as MenuPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";
import type { LinkComponent } from "../lib/link";

export type MenuEntry =
  | {
      type?: "item";
      label: ReactNode;
      icon?: ReactNode;
      onSelect?: () => void;
      /** Convierte la opción en enlace. */
      href?: string;
      /** Acción destructiva (texto en rojo). */
      destructive?: boolean;
      disabled?: boolean;
      /** Atajo de teclado mostrado a la derecha. */
      shortcut?: string;
      key?: string;
    }
  | { type: "separator"; key?: string }
  | { type: "label"; label: ReactNode; key?: string };

export interface MenuProps extends Omit<ComponentProps<typeof MenuPrimitive.Root>, "children"> {
  /** Disparador (normalmente un IconButton "Acciones"). */
  trigger: ReactNode;
  items: MenuEntry[];
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  /** Componente de enlace para opciones con `href`. */
  linkComponent?: LinkComponent;
  className?: string;
}

const itemClasses = [
  "relative flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-fg outline-none select-none no-underline",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:bg-bg-sunken",
  "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-subtle",
].join(" ");

/** Menú de acciones (Radix Dropdown Menu): acciones por fila, menú de usuario. */
export function Menu({
  trigger,
  items,
  align = "end",
  side = "bottom",
  linkComponent: Link = "a",
  className,
  ...props
}: MenuProps) {
  return (
    <MenuPrimitive.Root {...props}>
      <MenuPrimitive.Trigger asChild>{trigger}</MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Content
          align={align}
          side={side}
          sideOffset={4}
          className={cn(
            "z-dropdown min-w-48 rounded-md border border-border bg-bg p-1 font-ui text-fg shadow-overlay outline-none",
            "data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in motion-reduce:animate-none",
            className,
          )}
        >
          {items.map((entry, index) => {
            const key = entry.key ?? String(index);
            if (entry.type === "separator") {
              return <MenuPrimitive.Separator key={key} className="my-1 h-px bg-border" />;
            }
            if (entry.type === "label") {
              return (
                <MenuPrimitive.Label
                  key={key}
                  className="px-2.5 pt-2 pb-1 text-2xs font-medium tracking-label text-fg-subtle uppercase"
                >
                  {entry.label}
                </MenuPrimitive.Label>
              );
            }
            const content = (
              <>
                {entry.icon}
                <span className="flex-1">{entry.label}</span>
                {entry.shortcut ? (
                  <kbd className="font-ui text-2xs text-fg-subtle">{entry.shortcut}</kbd>
                ) : null}
              </>
            );
            const classes = cn(itemClasses, entry.destructive && "text-danger [&_svg]:text-danger");
            return entry.href ? (
              <MenuPrimitive.Item
                key={key}
                asChild
                disabled={entry.disabled}
                onSelect={entry.onSelect}
                className={classes}
              >
                <Link href={entry.href}>{content}</Link>
              </MenuPrimitive.Item>
            ) : (
              <MenuPrimitive.Item
                key={key}
                disabled={entry.disabled}
                onSelect={entry.onSelect}
                className={classes}
              >
                {content}
              </MenuPrimitive.Item>
            );
          })}
        </MenuPrimitive.Content>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}
