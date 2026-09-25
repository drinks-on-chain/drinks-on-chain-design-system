"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { Menu as MenuIcon, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing, labelText } from "../lib/styles";
import { AppLink, isNavItemActive, type LinkComponent, type NavGroup } from "../lib/link";
import { Avatar } from "../components/avatar";
import { Breadcrumbs, type BreadcrumbItem } from "../components/breadcrumbs";
import { IconButton } from "../components/icon-button";
import { Menu, type MenuEntry } from "../components/menu";
import { Wordmark } from "../components/wordmark";

// Base común de AppShell (ERP) y AdminShell (Backoffice). No se exporta desde el índice.

export interface ShellUser {
  name: string;
  /** Rol o contexto bajo el nombre ("Enóloga · Cinti Viejo"). */
  role?: ReactNode;
  avatarSrc?: string;
}

export interface ShellLabels {
  openMenu?: string;
  closeMenu?: string;
  collapse?: string;
  expand?: string;
  navigation?: string;
  userMenu?: string;
}

const defaultLabels: Required<ShellLabels> = {
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  collapse: "Contraer menú",
  expand: "Expandir menú",
  navigation: "Navegación principal",
  userMenu: "Menú de usuario",
};

export interface SidebarShellProps {
  /** Grupos de navegación de la barra lateral. */
  navigation: NavGroup[];
  /** Ruta actual para marcar el elemento activo (p. ej. `usePathname()`). */
  currentPath?: string;
  /** Componente de enlace (Next: `Link` de `next/link`). */
  linkComponent?: LinkComponent;
  /** Marca arriba de la barra lateral (por defecto el Wordmark). */
  brand?: ReactNode;
  /** Marca compacta para la barra colapsada. */
  brandCompact?: ReactNode;
  /** Href del logotipo. */
  brandHref?: string;
  user?: ShellUser;
  /** Opciones del menú de usuario (perfil, cerrar sesión). */
  userMenu?: MenuEntry[];
  /** Migas de pan de la barra superior. */
  breadcrumbs?: BreadcrumbItem[];
  /** Contenido a la izquierda de la barra superior cuando no hay migas. */
  topbarStart?: ReactNode;
  /** Acción principal y demás controles a la derecha de la barra superior. */
  topbarActions?: ReactNode;
  /** Barra lateral colapsada a 72 px en escritorio (en tablet siempre lo está). */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  labels?: ShellLabels;
  className?: string;
  contentClassName?: string;
  children?: ReactNode;
}

interface InternalProps extends SidebarShellProps {
  variant: "app" | "admin";
}

export function SidebarShell({
  variant,
  navigation,
  currentPath,
  linkComponent,
  brand,
  brandCompact,
  brandHref,
  user,
  userMenu,
  breadcrumbs,
  topbarStart,
  topbarActions,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  labels: labelsProp,
  className,
  contentClassName,
  children,
}: InternalProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const [collapsedState, setCollapsedState] = useState(defaultCollapsed);
  const collapsed = collapsedProp ?? collapsedState;
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    const next = !collapsed;
    if (collapsedProp === undefined) setCollapsedState(next);
    onCollapsedChange?.(next);
  };

  const sidebarTheme = variant === "admin" ? "cava" : undefined;

  const renderSidebar = (mode: "desktop" | "mobile") => {
    // En escritorio: colapsada si el usuario lo pide; en tablet (md–lg) siempre.
    const hideText = mode === "mobile" ? "" : collapsed ? "sr-only" : "md:max-lg:sr-only";
    const hideBlock = mode === "mobile" ? "" : collapsed ? "hidden" : "md:max-lg:hidden";
    const showCompact = mode === "mobile" ? "hidden" : collapsed ? "" : "hidden md:max-lg:inline";
    const centerWhenCollapsed =
      mode === "mobile"
        ? ""
        : collapsed
          ? "justify-center px-0"
          : "md:max-lg:justify-center md:max-lg:px-0";

    const brandNode = (
      <>
        <span className={hideBlock}>{brand ?? <Wordmark size="lg" />}</span>
        <span className={showCompact}>{brandCompact ?? <Wordmark size="lg" compact />}</span>
      </>
    );

    return (
      <div className="flex h-full flex-col gap-4 px-3 py-5">
        <div className={cn("flex min-h-8 items-center px-3 pb-3", centerWhenCollapsed)}>
          {brandHref ? (
            <AppLink
              as={linkComponent}
              href={brandHref}
              aria-label="Drinks on Chain"
              className={cn("rounded-sm text-fg no-underline", focusRing)}
            >
              {brandNode}
            </AppLink>
          ) : (
            brandNode
          )}
        </div>
        <nav aria-label={labels.navigation} className="grid gap-0.5">
          {navigation.map((group, groupIndex) => (
            <div key={groupIndex} className="grid gap-0.5">
              {group.label ? (
                <>
                  <span className={cn(labelText, "px-3 pt-4 pb-1", hideBlock)}>{group.label}</span>
                  {mode === "desktop" ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mx-3 my-2 h-px bg-border",
                        collapsed ? "block" : "hidden md:max-lg:block",
                      )}
                    />
                  ) : null}
                </>
              ) : null}
              {group.items.map((item) => {
                const active = isNavItemActive(item, currentPath);
                return (
                  <AppLink
                    key={item.href}
                    as={linkComponent}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    title={mode === "desktop" && collapsed ? item.label : undefined}
                    onClick={mode === "mobile" ? () => setMobileOpen(false) : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-2.5 rounded-md px-3 text-sm font-medium text-fg-muted no-underline",
                      "transition-[background-color,color] hover:bg-bg-sunken hover:text-fg",
                      "aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-text aria-[current=page]:shadow-[inset_2px_0_0_var(--doc-accent)]",
                      "[&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:stroke-[1.5]",
                      centerWhenCollapsed,
                      focusRing,
                    )}
                  >
                    {item.icon}
                    <span className={cn("min-w-0 flex-1 truncate", hideText)}>{item.label}</span>
                    {item.badge ? <span className={hideBlock}>{item.badge}</span> : null}
                  </AppLink>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="mt-auto grid gap-2">
          {user ? (
            <UserBlock
              user={user}
              userMenu={userMenu}
              label={labels.userMenu}
              hideText={hideText}
              center={centerWhenCollapsed}
            />
          ) : null}
          {mode === "desktop" ? (
            <div className={cn("hidden lg:flex", collapsed ? "justify-center" : "justify-end")}>
              <IconButton
                size="sm"
                label={collapsed ? labels.expand : labels.collapse}
                aria-expanded={!collapsed}
                onClick={toggleCollapsed}
              >
                {collapsed ? <PanelLeftOpen aria-hidden /> : <PanelLeftClose aria-hidden />}
              </IconButton>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const shellStyle = { "--doc-sticky-offset": "var(--doc-topbar-h)" } as CSSProperties;

  return (
    <div
      className={cn(
        "min-h-dvh bg-bg font-ui text-fg md:grid",
        collapsed
          ? "md:grid-cols-[var(--doc-sidebar-w-collapsed)_minmax(0,1fr)]"
          : "md:grid-cols-[var(--doc-sidebar-w-collapsed)_minmax(0,1fr)] lg:grid-cols-[var(--doc-sidebar-w)_minmax(0,1fr)]",
        className,
      )}
      style={shellStyle}
    >
      <aside
        data-theme={sidebarTheme}
        className="sticky top-0 hidden h-dvh overflow-y-auto border-r border-border bg-bg-raised text-fg md:block"
      >
        {renderSidebar("desktop")}
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-sticky flex h-(--doc-topbar-h) items-center justify-between gap-4 border-b border-border bg-bg px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <DialogPrimitive.Trigger asChild>
                <IconButton label={labels.openMenu} className="-ml-2 md:hidden">
                  <MenuIcon aria-hidden />
                </IconButton>
              </DialogPrimitive.Trigger>
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-overlay bg-overlay data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in motion-reduce:animate-none md:hidden" />
                <DialogPrimitive.Content
                  aria-describedby={undefined}
                  data-theme={sidebarTheme}
                  className="fixed inset-y-0 left-0 z-modal w-[min(280px,85vw)] overflow-y-auto bg-bg-raised font-ui text-fg shadow-overlay outline-none data-[state=closed]:animate-slide-out-left data-[state=open]:animate-slide-in-left motion-reduce:animate-none md:hidden"
                >
                  <DialogPrimitive.Title className="sr-only">
                    {labels.navigation}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close asChild>
                    <IconButton
                      label={labels.closeMenu}
                      size="sm"
                      className="absolute top-4 right-3"
                    >
                      <X aria-hidden />
                    </IconButton>
                  </DialogPrimitive.Close>
                  {renderSidebar("mobile")}
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
            {breadcrumbs ? (
              <Breadcrumbs items={breadcrumbs} linkComponent={linkComponent} />
            ) : (
              topbarStart
            )}
          </div>
          {topbarActions ? (
            <div className="flex shrink-0 items-center gap-3">{topbarActions}</div>
          ) : null}
        </header>
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div
            className={cn(
              "mx-auto w-full",
              variant === "admin" ? "max-w-(--doc-content-max-wide)" : "max-w-(--doc-content-max)",
              contentClassName,
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function UserBlock({
  user,
  userMenu,
  label,
  hideText,
  center,
}: {
  user: ShellUser;
  userMenu?: MenuEntry[];
  label: string;
  hideText: string;
  center: string;
}) {
  const content = (
    <>
      <Avatar name={user.name} src={user.avatarSrc} />
      <span className={cn("grid min-w-0 flex-1 text-left", hideText)}>
        <span className="truncate text-sm font-medium text-fg">{user.name}</span>
        {user.role ? <span className="truncate text-xs text-fg-subtle">{user.role}</span> : null}
      </span>
    </>
  );
  const classes = cn(
    "flex w-full items-center gap-2.5 border-t border-border px-3 pt-3 pb-1",
    center,
  );
  if (!userMenu?.length) return <div className={classes}>{content}</div>;
  return (
    <Menu
      side="top"
      align="start"
      items={userMenu}
      trigger={
        <button
          type="button"
          aria-label={`${label}: ${user.name}`}
          className={cn(classes, "cursor-pointer rounded-b-md hover:bg-bg-sunken", focusRing)}
        >
          {content}
        </button>
      }
    />
  );
}
