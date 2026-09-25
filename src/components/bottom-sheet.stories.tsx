import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomSheet } from "./bottom-sheet";
import { Button } from "./button";

const meta = {
  title: "Componentes/Overlays/BottomSheet",
  component: BottomSheet,
  globals: { viewport: { value: "sm375", isRotated: false } },
  args: {
    title: "Adquirir · 2 botellas",
    trigger: <Button>Adquirir</Button>,
    children: <p className="m-0 text-sm">Singani Gran Reserva 2026 · Bs 190 c/u</p>,
    footer: (
      <Button block size="lg">
        Pagar Bs 380
      </Button>
    ),
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Abierto: Story = { args: { defaultOpen: true } };
