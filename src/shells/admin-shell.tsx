"use client";

import { Search } from "lucide-react";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import { formatHotkey, isApplePlatform, useHotkey } from "../lib/use-hotkey";
import { CommandPalette, type CommandPaletteProps } from "../components/command-palette";
import { SidebarShell, type SidebarShellProps } from "./sidebar-shell";

export interface AdminShellSearch {
  /** Abre el buscador global (CommandPalette de la app). Opcional si se usa `commandPalette`. */
  onOpen?: () => void;
  placeholder?: string;
  /** Atajo mostrado (por defecto "⌘K" en macOS y "Ctrl K" en el resto); ⌘K / Ctrl+K y "/" abren. */
  shortcutLabel?: string;
  /** Desactiva los atajos de teclado. */
  disableShortcuts?: boolean;
}

export interface AdminShellProps extends SidebarShellProps {
  /** Disparador del buscador global en la barra superior. */
  search?: AdminShellSearch;
  /**
   * Paleta de comandos integrada: el shell la abre con el buscador, ⌘K / Ctrl+K y "/" y gestiona
   * su estado. Si se omite, la app abre la suya con `search.onOpen`.
   */
  commandPalette?: Omit<CommandPaletteProps, "open" | "defaultOpen" | "onOpenChange" | "hotkey">;
  /** Selector de organización activa (OrganizationSwitcher) en la barra superior. */
  organizationSwitcher?: ReactNode;
  /** Campana de notificaciones u otros indicadores, junto a las acciones. */
  notifications?: ReactNode;
}

const noopSubscribe = () => () => {};

/**
 * Shell del Backoffice: como AppShell, con la barra lateral en tema Cava Reserva, buscador
 * global (⌘K, "/") que abre la CommandPalette, selector de organización y notificaciones en la
 * barra superior; menú de usuario abajo en la barra lateral; contenido de 1440 px en Inter 14 px.
 */
export function AdminShell({
  search,
  commandPalette,
  organizationSwitcher,
  notifications,
  topbarStart,
  topbarActions,
  breadcrumbs,
  className,
  ...props
}: AdminShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const hasSearch = Boolean(search || commandPalette);
  const onOpenProp = search?.onOpen;
  const open = () => {
    if (commandPalette) setPaletteOpen(true);
    onOpenProp?.();
  };
  // "⌘K" en el servidor y en macOS; "Ctrl K" en el resto tras hidratar (sin desajuste).
  const apple = useSyncExternalStore(noopSubscribe, isApplePlatform, () => true);

  useHotkey(["mod+k", "/"], () => (paletteOpen ? undefined : open()), {
    enabled: hasSearch && !search?.disableShortcuts,
  });

  const searchTrigger = hasSearch ? (
    <button
      type="button"
      onClick={open}
      aria-keyshortcuts="Meta+K Control+K /"
      aria-haspopup={commandPalette ? "dialog" : undefined}
      className={cn(
        "flex h-9 w-full max-w-80 min-w-0 cursor-pointer items-center gap-2.5 rounded-md border border-border-strong bg-bg-raised px-3 text-left text-sm text-fg-subtle",
        "transition-[border-color] hover:border-fg-subtle md:min-w-80",
        focusRing,
      )}
    >
      <Search className="size-4 shrink-0" aria-hidden />
      <span className="flex-1 truncate">
        {search?.placeholder ?? commandPalette?.placeholder ?? "Buscar…"}
      </span>
      <kbd className="hidden rounded-sm border border-border px-1.5 py-0.5 font-ui text-2xs font-medium sm:inline">
        {search?.shortcutLabel ?? formatHotkey("mod+k", apple)}
      </kbd>
    </button>
  ) : null;

  const actions =
    organizationSwitcher || notifications || topbarActions ? (
      <>
        {organizationSwitcher}
        {notifications}
        {topbarActions}
      </>
    ) : undefined;

  return (
    <>
      <SidebarShell
        variant="admin"
        {...props}
        className={cn("text-sm", className)}
        breadcrumbs={hasSearch ? undefined : breadcrumbs}
        topbarStart={searchTrigger ?? topbarStart}
        topbarActions={actions}
      />
      {commandPalette ? (
        <CommandPalette
          {...commandPalette}
          hotkey={false}
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
        />
      ) : null}
    </>
  );
}
