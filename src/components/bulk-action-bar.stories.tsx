import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { BulkActionBar } from "./bulk-action-bar";
import { Button } from "./button";

const meta = {
  title: "Componentes/Datos/BulkActionBar",
  component: BulkActionBar,
  args: {
    count: 3,
    onClear: fn(),
    children: (
      <>
        <Button size="sm" variant="secondary">
          Reenviar invitaciones
        </Button>
        <Button size="sm" variant="secondary">
          Exportar
        </Button>
        <Button size="sm" variant="destructive">
          Anular
        </Button>
      </>
    ),
  },
  decorators: [(Story) => <div className="max-w-4xl">{Story()}</div>],
} satisfies Meta<typeof BulkActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Una: Story = { args: { count: 1 } };

export const Cava: Story = { globals: { theme: "cava" } };
