import type { Meta, StoryObj } from "@storybook/react-vite";
import { Countdown } from "./countdown";

// Fechas fijas para que las capturas sean estables.
const now = new Date("2026-05-24T09:00:00-04:00");

const meta = {
  title: "Componentes/Datos/Countdown",
  component: Countdown,
  args: { target: "2026-10-13T14:00:00-04:00", now, tone: "warning" },
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Display: Story = {};

export const SoloDias: Story = { args: { format: "days" } };

export const EnLinea: Story = {
  args: { variant: "inline", tone: "neutral", target: "2026-05-30T20:00:00-04:00" },
  render: (args) => (
    <p className="m-0 text-sm text-fg-muted">
      Pase activo · caduca en <Countdown {...args} />
    </p>
  ),
};

export const Cumplido: Story = { args: { target: "2026-05-01T00:00:00-04:00" } };

export const EnVivo: Story = {
  args: { now: undefined, target: new Date(Date.now() + 3 * 86_400_000 + 5 * 3_600_000) },
};
