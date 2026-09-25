import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Field } from "./field";
import { Input } from "./input";
import { SlideOver } from "./slide-over";

const meta = {
  title: "Componentes/Overlays/SlideOver",
  component: SlideOver,
  args: {
    title: "Nueva cosecha",
    trigger: <Button>Nueva cosecha</Button>,
    children: (
      <div className="grid gap-4">
        <Field label="Inicio de vendimia">
          <Input type="date" defaultValue="2026-03-04" />
        </Field>
        <Field label="Rendimiento proyectado">
          <Input numeric defaultValue="18000" suffix="kg" />
        </Field>
      </div>
    ),
    footer: <Button block>Guardar temporada</Button>,
  },
} satisfies Meta<typeof SlideOver>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Abierto: Story = { args: { defaultOpen: true } };

export const Izquierda: Story = { args: { side: "left", size: "sm" } };
