import type { ComponentType, MouseEventHandler, ReactNode } from "react";

/** Props mínimas que el paquete pasa al componente de enlace (compatible con `next/link`). */
export interface LinkComponentProps {
  href: string;
  className?: string;
  children?: ReactNode;
  title?: string;
  "aria-current"?: "page" | "step" | "true" | undefined;
  "aria-label"?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/**
 * Componente que renderiza los enlaces de shells, migas y pestañas.
 * Por defecto `<a>`; en Next.js se inyecta `Link` de `next/link`.
 */
export type LinkComponent = ComponentType<LinkComponentProps> | "a";

/** Elemento de navegación de un shell. */
export interface NavItem {
  label: string;
  href: string;
  /** Icono (p. ej. de lucide-react), 20 px recomendado. */
  icon?: ReactNode;
  /** Fuerza el estado activo; si se omite se calcula con `currentPath`. */
  active?: boolean;
  /** Solo coincide la ruta exacta al calcular el estado activo. */
  exact?: boolean;
  /** Contenido a la derecha (contador, badge). */
  badge?: ReactNode;
}

/** Grupo de navegación con título opcional. */
export interface NavGroup {
  label?: string;
  items: NavItem[];
}

/** Decide si un elemento está activo para la ruta actual. */
export function isNavItemActive(item: NavItem, currentPath?: string): boolean {
  if (item.active !== undefined) return item.active;
  if (!currentPath) return false;
  const path = stripTrailingSlash(currentPath.split(/[?#]/)[0] ?? "");
  const href = stripTrailingSlash(item.href.split(/[?#]/)[0] ?? "");
  if (item.exact || href === "") return path === href;
  return path === href || path.startsWith(href + "/");
}

function stripTrailingSlash(value: string): string {
  return value.length > 1 && value.endsWith("/") ? value.slice(0, -1) : value === "/" ? "" : value;
}

/** Renderiza un enlace con el componente inyectado o `<a>`. */
export function AppLink({
  as: Component = "a",
  ...props
}: LinkComponentProps & { as?: LinkComponent | undefined }) {
  return <Component {...props} />;
}
