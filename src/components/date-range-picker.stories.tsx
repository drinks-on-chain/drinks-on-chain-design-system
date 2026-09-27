import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateRangePicker, lastDaysRange, type DateRange } from "./date-range-picker";

const today = new Date(2026, 8, 27);

const meta = {
  title: "Componentes/Formularios/DateRangePicker",
  component: DateRangePicker,
  args: {
    label: "Fecha del evento",
    max: "2026-09-27",
    presets: [
      { label: "Hoy", range: lastDaysRange(1, today) },
      { label: "7 días", range: lastDaysRange(7, today) },
      { label: "30 días", range: lastDaysRange(30, today) },
    ],
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function Controlled() {
  const [range, setRange] = useState<DateRange>({ from: "2026-09-01", to: "2026-09-27" });
  return (
    <div className="grid gap-2">
      <DateRangePicker
        label="Exportar bitácora"
        help="Máximo 90 días por exportación."
        maxDays={90}
        required
        value={range}
        onValueChange={setRange}
      />
      <code className="font-mono text-xs text-fg-subtle">
        from={range.from ?? "—"} · to={range.to ?? "—"}
      </code>
    </div>
  );
}

export const Controlado: Story = { render: () => <Controlled /> };

export const RangoInvalido: Story = {
  args: { defaultValue: { from: "2026-09-20", to: "2026-09-10" }, presets: undefined },
};

export const Mediano: Story = { args: { size: "md", presets: undefined } };

export const Cava: Story = { globals: { theme: "cava" } };
