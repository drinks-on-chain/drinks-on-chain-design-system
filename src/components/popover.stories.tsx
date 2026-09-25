import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Popover, PopoverClose } from "./popover";

const meta = {
  title: "Componentes/Overlays/Popover",
  component: Popover,
  args: {
    trigger: <Button variant="secondary">Filtros</Button>,
    children: (
      <div className="grid gap-3">
        <strong className="text-sm">Región</strong>
        <Checkbox label="Tarija" defaultChecked />
        <Checkbox label="Cinti" />
        <PopoverClose asChild>
          <Button size="sm">Aplicar</Button>
        </PopoverClose>
      </div>
    ),
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
