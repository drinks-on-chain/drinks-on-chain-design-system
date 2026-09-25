import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Columnas de la rejilla de campos desde 768 px. */
  columns?: 1 | 2 | 3 | 4;
  /** Acciones de la sección (alineadas a la derecha, bajo los campos). */
  actions?: ReactNode;
}

const columnClasses = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/** Agrupa campos relacionados con título y descripción. */
export function FormSection({
  title,
  description,
  columns = 1,
  actions,
  className,
  children,
  ...props
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "grid gap-4 border-t border-border pt-5 first:border-t-0 first:pt-0",
        className,
      )}
      {...props}
    >
      <header className="grid gap-1">
        <h3 className="m-0 font-ui text-md font-semibold text-fg">{title}</h3>
        {description ? <p className="m-0 text-sm text-fg-muted">{description}</p> : null}
      </header>
      <div className={cn("grid gap-4", columnClasses[columns])}>{children}</div>
      {actions ? <div className="flex flex-wrap justify-end gap-2">{actions}</div> : null}
    </section>
  );
}
