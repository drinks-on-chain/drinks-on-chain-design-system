import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./field";
import { Input, Textarea } from "./input";
import { Select } from "./select";

const meta = {
  title: "Componentes/Formularios/Field",
  component: Field,
  args: {
    label: "Correo electrónico",
    help: "Usaremos este correo para las credenciales.",
    required: true,
    children: <Input placeholder="nombre@bodega.bo" type="email" />,
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ConError: Story = {
  args: {
    label: "Contraseña",
    help: undefined,
    error: "La contraseña no es correcta.",
    children: <Input type="password" defaultValue="secreto" />,
  },
};

export const Rejilla: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4 md:grid-cols-2">
      <Field label="Correo electrónico" required help="Usaremos este correo para las credenciales.">
        <Input placeholder="nombre@bodega.bo" />
      </Field>
      <Field label="Cepa">
        <Select
          defaultValue="moscatel"
          options={[
            { value: "moscatel", label: "Moscatel de Alejandría" },
            { value: "tannat", label: "Tannat" },
          ]}
        />
      </Field>
      <Field label="Altitud">
        <Input numeric defaultValue="2350" suffix="m s. n. m." />
      </Field>
      <Field label="Contraseña" error="La contraseña no es correcta.">
        <Input type="password" defaultValue="secreto" />
      </Field>
      <Field label="Notas de cata" help="Opcional" className="md:col-span-2">
        <Textarea placeholder="Notas de cata, con qué lo acompañaste…" />
      </Field>
    </div>
  ),
};
