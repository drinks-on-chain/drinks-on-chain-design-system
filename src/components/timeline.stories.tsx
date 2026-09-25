import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./timeline";

const meta = {
  title: "Componentes/Datos/Timeline",
  component: Timeline,
  args: {
    items: [
      { title: "Origen · Cinti 02", time: "12 ene 2026", status: "done" },
      { title: "Vendimia · 18.400 kg", time: "4 mar 2026", status: "done" },
      { title: "Destilación · 1.500 L corazón · 60 %", time: "15 abr 2026", status: "done" },
      { title: "Reposo · candado hasta el 13 oct", time: "en curso", status: "current" },
      { title: "Embotellado", status: "pending" },
    ],
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Trazabilidad: Story = {};
