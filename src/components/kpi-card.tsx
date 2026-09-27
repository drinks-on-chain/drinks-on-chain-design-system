import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { focusRing } from "../lib/styles";
import { AppLink, type LinkComponent } from "../lib/link";
import { Skeleton } from "./skeleton";
import { StatCard, type StatCardProps } from "./stat-card";

export interface KpiBreakdownItem {
  label: ReactNode;
  value: ReactNode;
  key?: string;
}

export interface KpiCardProps extends Omit<StatCardProps, "value" | "footer"> {
  value: ReactNode;
  /** Cifra en carga: esqueleto en lugar del número. */
  loading?: boolean;
  /** Desglose bajo la cifra (p. ej. recibidas · en revisión · reunión). */
  breakdown?: KpiBreakdownItem[];
  /** Enlace a la lista filtrada ("Ver bandeja"). */
  href?: string;
  linkLabel?: string;
  linkComponent?: LinkComponent;
  /** Texto de carga para lectores de pantalla. */
  loadingLabel?: string;
}

/**
 * Tarjeta de KPI del tablero del Backoffice: StatCard (cifra display de 36 px y variación) con
 * estado de carga, desglose y enlace a la lista correspondiente.
 */
export function KpiCard({
  value,
  loading = false,
  breakdown,
  href,
  linkLabel = "Ver detalle",
  linkComponent,
  loadingLabel = "Cargando…",
  delta,
  className,
  ...props
}: KpiCardProps) {
  const footer =
    breakdown?.length || href ? (
      <div className="grid gap-2">
        {breakdown?.length ? (
          <dl className="m-0 flex flex-wrap gap-x-4 gap-y-1">
            {breakdown.map((item, index) => (
              <div key={item.key ?? index} className="flex items-baseline gap-1.5">
                <dt className="text-fg-subtle">{item.label}</dt>
                <dd className="m-0 font-medium text-fg tabular-nums">
                  {loading ? "—" : item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {href ? (
          <AppLink
            as={linkComponent}
            href={href}
            className={cn(
              "inline-flex items-center gap-1 justify-self-start rounded-sm font-medium text-accent-text no-underline hover:underline",
              focusRing,
            )}
          >
            {linkLabel}
            <ArrowRight className="size-3.5" aria-hidden />
          </AppLink>
        ) : null}
      </div>
    ) : undefined;

  return (
    <StatCard
      {...props}
      aria-busy={loading || undefined}
      className={cn("h-full", className)}
      value={
        loading ? (
          <>
            <Skeleton className="inline-block h-9 w-20 align-middle" />
            <span className="sr-only">{loadingLabel}</span>
          </>
        ) : (
          value
        )
      }
      delta={loading ? undefined : delta}
      footer={footer}
    />
  );
}
