import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./field";
import { RadioGroup } from "./radio-group";

const meta = {
  title: "Componentes/Formularios/RadioGroup",
  component: RadioGroup,
  args: {
    defaultValue: "vino",
    "aria-label": "Tipo de producto",
    options: [
      { value: "vino", label: "Vino" },
      { value: "singani", label: "Singani" },
    ],
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = { args: { orientation: "horizontal" } };

export const Tarjetas: Story = {
  render: () => (
    <Field label="Método de pago" className="max-w-sm">
      <RadioGroup
        variant="card"
        defaultValue="tarjeta"
        options={[
          {
            value: "tarjeta",
            label: "Tarjeta de débito o crédito",
            description: "Pasarela del banco · formulario seguro",
          },
          { value: "qr", label: "QR bancario", description: "Escanea con la app de tu banco" },
        ]}
      />
    </Field>
  ),
};
