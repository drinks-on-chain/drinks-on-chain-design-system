"use client";

import { Check, Eye, UserRound } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { focusRing } from "../lib/styles";
import { cn } from "../lib/utils";

/** Nivel de acceso de un rol a una capacidad (`GET /v1/platform/permissions`). */
export type PermissionLevel = "FULL" | "READ" | "OWN" | "NONE";

export interface RoleMatrixCapability {
  key: string;
  label: ReactNode;
  description?: ReactNode;
  /** Nivel por rol; un rol ausente cuenta como `NONE`. */
  roles: Partial<Record<string, PermissionLevel>>;
}

export interface RoleMatrixRole {
  key: string;
  label: ReactNode;
}

export interface RoleMatrixLabels {
  capability?: string;
  levels?: Partial<Record<PermissionLevel, string>>;
  legend?: string;
}

const defaultLevels: Record<PermissionLevel, string> = {
  FULL: "Completo",
  READ: "Lectura",
  OWN: "Solo lo propio",
  NONE: "Sin acceso",
};

const levelIcons: Record<Exclude<PermissionLevel, "NONE">, ReactNode> = {
  FULL: <Check className="size-4" strokeWidth={2} aria-hidden />,
  READ: <Eye className="size-4 stroke-[1.5]" aria-hidden />,
  OWN: <UserRound className="size-4 stroke-[1.5]" aria-hidden />,
};

const levelClasses: Record<PermissionLevel, string> = {
  FULL: "font-medium text-fg",
  READ: "text-fg-muted",
  OWN: "text-fg-muted",
  NONE: "text-fg-subtle",
};

export interface RoleMatrixProps {
  capabilities: RoleMatrixCapability[];
  /** Columnas en orden. Por defecto, los roles de la primera capacidad. */
  roles?: RoleMatrixRole[];
  /** Título accesible de la tabla (por defecto oculto). */
  caption?: ReactNode;
  captionHidden?: boolean;
  /** Resalta la columna de un rol (p. ej. el de la persona). */
  highlightRole?: string;
  /** Muestra la leyenda de niveles bajo la tabla (por defecto sí). */
  legend?: boolean;
  density?: "comfortable" | "compact";
  labels?: RoleMatrixLabels;
  className?: string;
}

/**
 * Matriz de capacidades × roles (PLT-04) con valores FULL / READ / OWN / NONE. Es una tabla con
 * cabeceras de fila y columna: el lector de pantalla anuncia "capacidad, rol, nivel" en cada celda.
 */
export function RoleMatrix({
  capabilities,
  roles: rolesProp,
  caption = "Permisos por rol",
  captionHidden = true,
  highlightRole,
  legend = true,
  density = "compact",
  labels,
  className,
}: RoleMatrixProps) {
  const levels = { ...defaultLevels, ...labels?.levels };
  const captionId = `role-matrix-${useId()}`;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const overflows = useHorizontalOverflow(scrollerRef);
  const roles: RoleMatrixRole[] =
    rolesProp ?? Object.keys(capabilities[0]?.roles ?? {}).map((key) => ({ key, label: key }));
  const cellPadding = density === "compact" ? "px-3 py-[7px]" : "px-3 py-3";
  const headClasses =
    "border-b border-border-strong bg-bg-sunken px-3 py-2 font-ui text-2xs leading-tight font-medium tracking-label whitespace-nowrap text-fg-subtle uppercase";

  return (
    <div className={cn("grid gap-3 font-ui text-sm text-fg", className)}>
      {/* Si la tabla desborda, el contenedor desplazable entra en el orden de tabulación para
          poder recorrerlo con las flechas (axe scrollable-region-focusable). */}
      <div
        ref={scrollerRef}
        {...(overflows ? { tabIndex: 0, role: "region", "aria-labelledby": captionId } : {})}
        className={cn("overflow-x-auto rounded-md border border-border", focusRing)}
      >
        <table className="w-full border-separate border-spacing-0 [&>tbody>tr:last-child>*]:border-b-0">
          <caption
            id={captionId}
            className={captionHidden ? "sr-only" : "px-3 py-2 text-left font-medium"}
          >
            {caption}
          </caption>
          <thead>
            <tr>
              <th scope="col" className={cn(headClasses, "text-left")}>
                {labels?.capability ?? "Capacidad"}
              </th>
              {roles.map((role) => (
                <th
                  key={role.key}
                  scope="col"
                  data-highlight={role.key === highlightRole || undefined}
                  className={cn(headClasses, "text-center data-highlight:text-fg")}
                >
                  {role.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {capabilities.map((capability) => (
              <tr key={capability.key}>
                <th
                  scope="row"
                  className={cn("border-b border-border text-left font-normal", cellPadding)}
                >
                  <span className="block font-medium">{capability.label}</span>
                  {capability.description ? (
                    <span className="block text-xs text-fg-subtle">{capability.description}</span>
                  ) : null}
                </th>
                {roles.map((role) => {
                  const level = capability.roles[role.key] ?? "NONE";
                  return (
                    <td
                      key={role.key}
                      data-level={level}
                      data-highlight={role.key === highlightRole || undefined}
                      className={cn(
                        "border-b border-border text-center whitespace-nowrap data-highlight:bg-bg-raised",
                        cellPadding,
                        levelClasses[level],
                      )}
                    >
                      {level === "NONE" ? (
                        <>
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">{levels.NONE}</span>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          {levelIcons[level]}
                          <span className="text-xs">{levels[level]}</span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {legend ? (
        <dl
          aria-label={labels?.legend ?? "Leyenda de niveles"}
          className="m-0 flex flex-wrap gap-x-5 gap-y-1 text-xs text-fg-muted"
        >
          {(["FULL", "READ", "OWN", "NONE"] as const).map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <dt className={cn("inline-flex", levelClasses[level])}>
                {level === "NONE" ? <span aria-hidden="true">—</span> : levelIcons[level]}
                <span className="sr-only">{level}</span>
              </dt>
              <dd className="m-0">{levels[level]}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

/** Indica si el contenido del elemento es más ancho que su caja (se desplaza en horizontal). */
function useHorizontalOverflow(ref: RefObject<HTMLElement | null>) {
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, [ref]);
  return overflows;
}
