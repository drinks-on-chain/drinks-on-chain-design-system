import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./field";
import { Input, Textarea } from "./input";

const meta = {
  title: "Componentes/Formularios/Input",
  component: Input,
  args: { placeholder: "nombre@bodega.bo", "aria-label": "Correo electrónico" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tamaños: Story = {
  render: () => (
    <div className="grid max-w-sm gap-3">
      <Input size="sm" aria-label="Pequeño" placeholder="sm · 32 px" />
      <Input aria-label="Mediano" placeholder="md · 40 px" />
      <Input size="lg" aria-label="Grande" placeholder="lg · 56 px (táctil)" />
    </div>
  ),
};

export const NumericoConSufijo: Story = {
  render: () => (
    <div className="grid max-w-md gap-4 md:grid-cols-2">
      <Field label="Corazón">
        <Input numeric defaultValue="1.500" suffix="L" />
      </Field>
      <Field label="Precio">
        <Input numeric defaultValue="190" prefix="Bs" />
      </Field>
    </div>
  ),
};

export const Gigante: Story = {
  render: () => (
    <div className="max-w-lg rounded-md bg-bg-sunken p-6">
      <Field label="Peso neto recibido" help="Fecha y hora se registran automáticamente">
        <Input giant defaultValue="18.400" suffix="kg" />
      </Field>
    </div>
  ),
};

export const AreaDeTexto: Story = {
  render: () => (
    <Field label="Notas" className="max-w-md">
      <Textarea placeholder="Notas de cata (opcional)" />
    </Field>
  ),
};
