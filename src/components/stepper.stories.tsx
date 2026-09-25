import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./stepper";

const meta = {
  title: "Componentes/Navegación/Stepper",
  component: Stepper,
  args: {
    current: 1,
    steps: [{ label: "Cantidad" }, { label: "Pago" }, { label: "Confirmación" }],
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkout: Story = {};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    current: 2,
    steps: [
      { label: "Datos de la bodega", description: "Razón social y región" },
      { label: "Cuenta Stellar", description: "La crea el backend" },
      { label: "Credenciales ERP", description: "Correo seguro al contacto" },
    ],
  },
};
