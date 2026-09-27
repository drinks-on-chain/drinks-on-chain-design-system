import type { Meta, StoryObj } from "@storybook/react-vite";
import { KpiCard } from "./kpi-card";

const meta = {
  title: "Componentes/Datos/KpiCard",
  component: KpiCard,
  args: {
    label: "Solicitudes abiertas",
    value: "7",
    delta: "+3 desde ayer",
    trend: "up",
    breakdown: [
      { label: "Recibidas", value: 4 },
      { label: "En revisión", value: 2 },
      { label: "Reunión", value: 1 },
    ],
    href: "/solicitudes",
    linkLabel: "Ver bandeja",
  },
  decorators: [(Story) => <div className="max-w-xs">{Story()}</div>],
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Cargando: Story = { args: { loading: true } };

/** Tablero del Backoffice (contrato O1 §8). */
export const Tablero: Story = {
  decorators: [(Story) => <div className="max-w-6xl text-sm">{Story()}</div>],
  render: () => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Solicitudes abiertas"
        value="7"
        breakdown={[
          { label: "Recibidas", value: 4 },
          { label: "En revisión", value: 2 },
          { label: "Reunión", value: 1 },
        ]}
        href="/solicitudes"
        linkLabel="Ver bandeja"
      />
      <KpiCard
        label="Bodegas activas"
        value="12"
        delta="+2 este mes"
        trend="up"
        breakdown={[
          { label: "Invitadas", value: 3 },
          { label: "Suspendidas", value: 1 },
        ]}
        href="/bodegas"
        linkLabel="Directorio"
      />
      <KpiCard
        label="Invitaciones pendientes"
        value="5"
        tone="warning"
        delta="2 caducan en 24 h"
        href="/usuarios?estado=invitado"
        linkLabel="Revisar"
      />
      <KpiCard label="Miembros bloqueados" value="1" loading />
    </div>
  ),
};

export const Cava: Story = { globals: { theme: "cava" } };
