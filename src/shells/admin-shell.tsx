"use client";

import { Search } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import { SidebarShell, type SidebarShellProps } from "./sidebar-shell";

export interface AdminShellSearch {
  /** Abre el buscador global (CommandPalette de la app). */
  onOpen: () => void;
  placeholder?: string;
  /** Atajo mostrado; ⌘K / Ctrl+K y "/" siempre abren el buscador. */
  shortcutLabel?: string;
  /** Desactiva los atajos de teclado. */
  disableShortcuts?: boolean;
}

export interface AdminShellProps extends SidebarShellProps {
  /** Disparador del buscador global en la barra superior. */
  search?: AdminShellSearch;
  /** Campana de notificaciones u otros indicadores, junto a las acciones. */
  notifications?: ReactNode;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/**
 * Shell del Backoffice: como AppShell, con la barra lateral en tema Cava Reserva,
 * buscador global (⌘K, "/") y notificaciones en la barra superior; contenido de 1440 px.
 */
export function AdminShell({
  search,
  notifications,
  topbarStart,
  topbarActions,
  breadcrumbs,
  ...props
}: AdminShellProps) {
  const onOpen = search?.onOpen;
  const shortcuts = Boolean(search && !search.disableShortcuts);

  useEffect(() => {
    if (!onOpen || !shortcuts) return;
    const handler = (event: KeyboardEvent) => {
      const commandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const slash = event.key === "/" && !isTypingTarget(event.target);
      if (commandK || slash) {
        event.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen, shortcuts]);

  const searchTrigger = search ? (
    <button
      type="button"
      onClick={search.onOpen}
      aria-keyshortcuts="Meta+K Control+K /"
      className={cn(
        "flex h-9 w-full max-w-80 min-w-0 cursor-pointer items-center gap-2.5 rounded-md border border-border-strong bg-bg-raised px-3 text-left text-sm text-fg-subtle",
        "transition-[border-color] hover:border-fg-subtle md:min-w-80",
        focusRing,
      )}
    >
      <Search className="size-4 shrink-0" aria-hidden />
      <span className="flex-1 truncate">{search.placeholder ?? "Buscar…"}</span>
      <kbd className="hidden rounded-sm border border-border px-1.5 py-0.5 font-ui text-2xs font-medium sm:inline">
        {search.shortcutLabel ?? "⌘K"}
      </kbd>
    </button>
  ) : null;

  return (
    <SidebarShell
      variant="admin"
      {...props}
      breadcrumbs={search ? undefined : breadcrumbs}
      topbarStart={searchTrigger ?? topbarStart}
      topbarActions={
        notifications || topbarActions ? (
          <>
            {notifications}
            {topbarActions}
          </>
        ) : undefined
      }
    />
  );
}
