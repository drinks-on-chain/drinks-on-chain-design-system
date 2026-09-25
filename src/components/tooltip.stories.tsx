import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";
import { IconButton } from "./icon-button";
import { Tooltip } from "./tooltip";

const meta = {
  title: "Componentes/Overlays/Tooltip",
  component: Tooltip,
  args: {
    content: "Mínimo 6 meses para Singani Gran Reserva",
    children: (
      <IconButton label="Información del candado" variant="outline">
        <Info aria-hidden />
      </IconButton>
    ),
  },
  decorators: [(Story) => <div className="p-12">{Story()}</div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Abierto: Story = { args: { defaultOpen: true, side: "right" } };
