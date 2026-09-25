import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./divider";

const meta = {
  title: "Componentes/Datos/Divider",
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Variantes: Story = {
  render: () => (
    <div className="max-w-md">
      <p className="m-0 text-sm">Hairline</p>
      <Divider />
      <p className="m-0 text-sm">Separador fuerte</p>
      <Divider strength="strong" />
      <Divider label="o" />
      <div className="flex h-8 items-center text-sm">
        Izquierda
        <Divider orientation="vertical" />
        Derecha
      </div>
    </div>
  ),
};
