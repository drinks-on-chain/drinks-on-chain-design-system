"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import { AppLink, isNavItemActive, type LinkComponent, type NavItem } from "../lib/link";
import { Wordmark } from "../components/wordmark";

export interface StoreShellProps {
  /** Pestañas inferiores en móvil (Inicio, Escáner, Cava, Perfil); icono obligatorio. */
  navigation: NavItem[];
  /** Enlaces de la cabecera de escritorio (por defecto los mismos que las pestañas). */
  desktopNavigation?: NavItem[];
  currentPath?: string;
  linkComponent?: LinkComponent;
  brand?: ReactNode;
  brandHref?: string;
  /** Acciones a la derecha de la cabecera (Entrar / Perfil, escáner). */
  headerActions?: ReactNode;
  /** Oculta las pestañas (ficha con barra de compra, checkout). */
  hideTabs?: boolean;
  /** Oculta la cabecera móvil (pantallas a sangre). */
  hideMobileHeader?: boolean;
  /** Familia tipográfica del contenido. */
  family?: "editorial" | "operativa";
  labels?: { navigation?: string; tabs?: string };
  className?: string;
  contentClassName?: string;
  children?: ReactNode;
}

/**
 * Shell del Marketplace. Móvil: cabecera compacta y pestañas inferiores de 64 px con safe-area.
 * Escritorio (≥ 768 px): cabecera con wordmark, enlaces editoriales y acciones; contenido de 1200 px.
 */
export function StoreShell({
  navigation,
  desktopNavigation,
  currentPath,
  linkComponent,
  brand,
  brandHref = "/",
  headerActions,
  hideTabs = false,
  hideMobileHeader = false,
  family = "editorial",
  labels,
  className,
  contentClassName,
  children,
}: StoreShellProps) {
  const desktopItems = desktopNavigation ?? navigation;
  const style = { "--doc-sticky-offset": "3.5rem" } as CSSProperties;

  return (
    <div className={cn("min-h-dvh bg-bg text-fg", className)} style={style}>
      <header
        className={cn(
          "sticky top-0 z-sticky border-b border-border bg-bg/92 backdrop-blur-md",
          hideMobileHeader && "max-md:hidden",
        )}
      >
        <div className="mx-auto flex h-14 max-w-(--doc-store-max) items-center justify-between gap-4 px-5 md:h-16 md:px-8">
          <AppLink
            as={linkComponent}
            href={brandHref}
            aria-label="Drinks on Chain"
            className={cn("rounded-sm text-fg no-underline", focusRing)}
          >
            {brand ?? <Wordmark size="md" className="md:text-lg" />}
          </AppLink>
          <nav
            aria-label={labels?.navigation ?? "Principal"}
            className="hidden items-center gap-7 font-display text-md md:flex"
          >
            {desktopItems.map((item) => {
              const active = isNavItemActive(item, currentPath);
              return (
                <AppLink
                  key={item.href}
                  as={linkComponent}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-block rounded-sm tracking-[0.1em] text-fg no-underline",
                    "after:block after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-(--doc-dur-reveal) after:ease-out after:content-['']",
                    "hover:after:scale-x-100 aria-[current=page]:text-accent-text aria-[current=page]:after:scale-x-100",
                    focusRing,
                  )}
                >
                  {item.label}
                </AppLink>
              );
            })}
          </nav>
          {headerActions ? (
            <div className="flex items-center gap-2 font-ui">{headerActions}</div>
          ) : (
            <span className="hidden md:block" />
          )}
        </div>
      </header>

      <main
        className={cn(
          "mx-auto w-full max-w-(--doc-store-max)",
          family === "editorial" ? "font-text" : "font-ui",
          !hideTabs && "pb-[calc(var(--doc-tabs-h)+env(safe-area-inset-bottom))] md:pb-0",
          contentClassName,
        )}
      >
        {children}
      </main>

      {hideTabs ? null : (
        <nav
          aria-label={labels?.tabs ?? "Pestañas"}
          className="fixed inset-x-0 bottom-0 z-sticky border-t border-border bg-bg-raised pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <ul
            className="m-0 grid h-(--doc-tabs-h) list-none p-0"
            style={{ gridTemplateColumns: `repeat(${navigation.length}, minmax(0, 1fr))` }}
          >
            {navigation.map((item) => {
              const active = isNavItemActive(item, currentPath);
              return (
                <li key={item.href} className="flex">
                  <AppLink
                    as={linkComponent}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex flex-1 flex-col items-center justify-center gap-1 font-ui text-2xs leading-none font-medium text-fg-subtle no-underline",
                      "aria-[current=page]:text-accent-text [&_svg]:size-[22px] [&_svg]:stroke-[1.5]",
                      focusRing,
                      "focus-visible:-outline-offset-2",
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
