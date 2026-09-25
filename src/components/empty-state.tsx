import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Icono de trazo fino (32 px). */
  icon?: ReactNode;
  /** Acción principal para salir del vacío. */
  action?: ReactNode;
  /** Sin borde discontinuo (dentro de tablas o tarjetas). */
  bare?: boolean;
  /** Nivel del título (por defecto 2, bajo el h1 de la página). */
  headingLevel?: 2 | 3 | 4;
}

/** Estado vacío con acción: obligatorio en cada listado (05 §4). */
export function EmptyState({
  title,
  description,
  icon,
  action,
  bare = false,
  headingLevel = 2,
  className,
  ...props
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div
      className={cn(
        "grid place-items-center gap-2 px-6 py-12 text-center font-ui text-fg-muted",
        !bare && "rounded-md border border-dashed border-border-strong",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="mb-1 text-fg-subtle [&_svg]:size-8 [&_svg]:stroke-[1.5]">{icon}</span>
      ) : null}
      <Heading className="m-0 font-display text-xl leading-tight font-medium text-fg">
        {title}
      </Heading>
      {description ? <p className="m-0 max-w-[36ch] text-sm">{description}</p> : null}
      {action ? <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}
