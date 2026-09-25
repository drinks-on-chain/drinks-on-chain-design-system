import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatCard } from "./stat-card";

const meta = {
  title: "Componentes/Datos/StatCard",
  component: StatCard,
  args: { label: "Lotes activos", value: "12", delta: "+2 esta semana", trend: "up" },
  decorators: [(Story) => <div className="max-w-xs">{Story()}</div>],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Rejilla: Story = {
  decorators: [(Story) => <div className="max-w-5xl">{Story()}</div>],
  render: () => (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard label="Lotes activos" value="12" delta="+2 esta semana" trend="up" />
      <StatCard label="Kilos procesados hoy" value="18.400" delta="3 ingresos" />
      <StatCard
        label="Tanques en fermentación"
        value="4"
        unit="/ 8"
        delta="1 listo para bifurcar"
      />
      <StatCard label="Alertas" value="2" tone="warning" delta="Temperatura · Tanque 04" />
    </div>
  ),
};
