import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch";

const meta = {
  title: "Componentes/Formularios/Switch",
  component: Switch,
  args: { label: "Notificaciones", defaultChecked: true },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ConDescripcion: Story = {
  args: {
    label: "Densidad compacta",
    description: "Filas de 36 px en las tablas del Backoffice.",
    labelPosition: "start",
    className: "w-80",
  },
};
