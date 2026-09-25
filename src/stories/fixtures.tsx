// Datos y piezas de ejemplo para las historias (no forman parte del paquete).
import type { SVGAttributes } from "react";

export interface LotRow {
  id: string;
  lot: string;
  winery: string;
  status: "reposo" | "tokenizado" | "listo" | "fermentacion" | "rechazado";
  bottles: number | null;
  updated: string;
}

export const lots: LotRow[] = [
  {
    id: "l1",
    lot: "SGR 2026 · 01",
    winery: "Cinti Viejo",
    status: "reposo",
    bottles: null,
    updated: "2026-09-20",
  },
  {
    id: "l2",
    lot: "Tannat Reserva 24",
    winery: "Altos de Calamuchita",
    status: "tokenizado",
    bottles: 2200,
    updated: "2026-09-18",
  },
  {
    id: "l3",
    lot: "Moscatel Blanco 25",
    winery: "Altos de Calamuchita",
    status: "listo",
    bottles: 1480,
    updated: "2026-09-22",
  },
  {
    id: "l4",
    lot: "Syrah 2024",
    winery: "Viñedos del Guadalquivir",
    status: "fermentacion",
    bottles: 900,
    updated: "2026-09-24",
  },
  {
    id: "l5",
    lot: "Clásico 2025",
    winery: "Cinti Viejo",
    status: "rechazado",
    bottles: 3000,
    updated: "2026-09-10",
  },
  {
    id: "l6",
    lot: "Blend de Altura 23",
    winery: "Casa Uriondo",
    status: "tokenizado",
    bottles: 1200,
    updated: "2026-09-01",
  },
];

export const statusBadge: Record<
  LotRow["status"],
  { label: string; tone: "neutral" | "accent" | "success" | "danger" | "warning" | "info" }
> = {
  reposo: { label: "Reposo", tone: "warning" },
  tokenizado: { label: "Tokenizado", tone: "accent" },
  listo: { label: "Listo", tone: "success" },
  fermentacion: { label: "En fermentación", tone: "info" },
  rechazado: { label: "Rechazado", tone: "danger" },
};

export const numberFormat = new Intl.NumberFormat("es-BO");

/** Silueta de botella a trazo (ilustración editorial de las maquetas). */
export function BottleArt({
  variant = "singani",
  className,
  ...props
}: SVGAttributes<SVGSVGElement> & { variant?: "singani" | "vino" }) {
  const body =
    variant === "singani"
      ? "M16 4h8v18c0 4 8 8 8 16v70c0 4-2 8-6 8H14c-4 0-6-4-6-8V38c0-8 8-12 8-16z"
      : "M15 4h10v20c0 6 7 10 7 18v66c0 4-2 8-6 8H14c-4 0-6-4-6-8V42c0-8 7-12 7-18z";
  return (
    <svg
      viewBox="0 0 40 120"
      aria-hidden="true"
      className={className}
      fill="none"
      strokeWidth={1.2}
      {...props}
    >
      <path d={body} className="stroke-fg-muted" />
      <path d="M10 60h20M10 78h20" className="stroke-accent" />
    </svg>
  );
}
