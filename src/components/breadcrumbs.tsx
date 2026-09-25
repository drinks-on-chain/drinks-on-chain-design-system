import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import { AppLink, type LinkComponent } from "../lib/link";

export interface BreadcrumbItem {
  label: ReactNode;
  /** Sin href el elemento es texto (el último siempre es la página actual). */
  href?: string;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  linkComponent?: LinkComponent;
  /** Nombre accesible de la navegación. */
  label?: string;
}

/** Migas de pan; el último elemento es la página actual (aria-current="page"). */
export function Breadcrumbs({
  items,
  linkComponent,
  label = "Migas de pan",
  className,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={cn("min-w-0", className)} {...props}>
      <ol className="m-0 flex min-w-0 list-none items-center gap-2 p-0 font-ui text-sm text-fg-subtle">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={index} className="flex min-w-0 items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-border-strong">
                  /
                </span>
              ) : null}
              {current ? (
                <span aria-current="page" className="truncate font-medium text-fg">
                  {item.label}
                </span>
              ) : item.href ? (
                <AppLink
                  as={linkComponent}
                  href={item.href}
                  className={cn(
                    "truncate rounded-sm text-fg-subtle no-underline hover:text-fg",
                    focusRing,
                  )}
                >
                  {item.label}
                </AppLink>
              ) : (
                <span className="truncate">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
