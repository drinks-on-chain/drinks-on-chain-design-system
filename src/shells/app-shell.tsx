"use client";

import { SidebarShell, type SidebarShellProps } from "./sidebar-shell";

export type { ShellLabels, ShellUser } from "./sidebar-shell";

export type AppShellProps = SidebarShellProps;

/**
 * Shell del ERP: barra lateral de 264 px (72 px colapsada; siempre colapsada en tablet,
 * cajón en móvil) con wordmark, grupos de navegación y usuario abajo; barra superior de 56 px
 * con migas y acción principal; contenido de 1280 px como máximo.
 */
export function AppShell(props: AppShellProps) {
  return <SidebarShell variant="app" {...props} />;
}
