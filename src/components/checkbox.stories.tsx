import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Componentes/Formularios/Checkbox",
  component: Checkbox,
  args: { label: "Recordar dispositivo", defaultChecked: true },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div className="grid gap-3">
      <Checkbox label="Sin marcar" />
      <Checkbox label="Marcada" defaultChecked />
      <Checkbox label="Indeterminada" checked="indeterminate" />
      <Checkbox label="Deshabilitada" disabled />
      <Checkbox
        label="Acepto los términos"
        description="Al continuar aceptas las condiciones de la tribu."
      />
    </div>
  ),
};
