"use client";

import { DropdownMenu as MenuPrimitive } from "radix-ui";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";

export interface OrganizationOption {
  id: string;
  name: string;
  /** Tipo o rol bajo el nombre ("Plataforma · ADMIN", "Bodega · OWNER"). */
  description?: string;
  /** Marca a la derecha (p. ej. un StatusBadge de la bodega). */
  badge?: ReactNode;
  disabled?: boolean;
}

export interface OrganizationSwitcherProps {
  organizations: OrganizationOption[];
  /** Organización activa (`activeOrganizationId` de la sesión). */
  activeId: string;
  /** Cambia de organización (la app llama a `switch-organization`). */
  onChange: (id: string) => void;
  /** Nombre accesible del selector. */
  label?: string;
  /** Icono a la izquierda del nombre. */
  icon?: ReactNode;
  className?: string;
}

/**
 * Selector de la organización activa para la cabecera de los shells. Con una sola organización
 * muestra su nombre sin menú.
 */
export function OrganizationSwitcher({
  organizations,
  activeId,
  onChange,
  label = "Organización activa",
  icon = <Building2 aria-hidden />,
  className,
}: OrganizationSwitcherProps) {
  const active = organizations.find((organization) => organization.id === activeId);
  const content = (
    <>
      <span className="shrink-0 text-fg-subtle [&_svg]:size-4">{icon}</span>
      <span className="min-w-0 truncate font-medium">{active?.name ?? "—"}</span>
    </>
  );
  const base = cn(
    "inline-flex h-9 max-w-64 min-w-0 items-center gap-2 rounded-md px-2.5 font-ui text-sm text-fg",
    className,
  );

  if (organizations.length <= 1) {
    return (
      <span className={base}>
        <span className="sr-only">{label}: </span>
        {content}
      </span>
    );
  }

  return (
    <MenuPrimitive.Root>
      <MenuPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={`${label}: ${active?.name ?? ""}`}
          className={cn(
            base,
            "cursor-pointer border border-border-strong bg-transparent transition-[background-color] hover:bg-bg-sunken",
            focusRing,
          )}
        >
          {content}
          <ChevronsUpDown className="size-3.5 shrink-0 text-fg-subtle" aria-hidden />
        </button>
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Content
          align="end"
          sideOffset={4}
          className={cn(
            "z-popover max-w-80 min-w-60 rounded-md border border-border bg-bg p-1 font-ui text-fg shadow-overlay outline-none",
            "data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in motion-reduce:animate-none",
          )}
        >
          <MenuPrimitive.Label className="px-2.5 pt-2 pb-1 text-2xs font-medium tracking-label text-fg-subtle uppercase">
            {label}
          </MenuPrimitive.Label>
          <MenuPrimitive.RadioGroup value={activeId} onValueChange={onChange}>
            {organizations.map((organization) => (
              <MenuPrimitive.RadioItem
                key={organization.id}
                value={organization.id}
                disabled={organization.disabled}
                className={cn(
                  "relative flex cursor-pointer items-start gap-2 rounded-sm py-2 pr-2.5 pl-8 text-sm outline-none select-none",
                  "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:bg-bg-sunken",
                )}
              >
                <MenuPrimitive.ItemIndicator className="absolute top-2.5 left-2.5 text-accent-text">
                  <Check className="size-4" aria-hidden />
                </MenuPrimitive.ItemIndicator>
                <span className="grid min-w-0 flex-1">
                  <span className="truncate">{organization.name}</span>
                  {organization.description ? (
                    <span className="truncate text-xs text-fg-subtle">
                      {organization.description}
                    </span>
                  ) : null}
                </span>
                {organization.badge}
              </MenuPrimitive.RadioItem>
            ))}
          </MenuPrimitive.RadioGroup>
        </MenuPrimitive.Content>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}
