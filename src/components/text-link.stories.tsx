import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLink } from "./text-link";

const meta = {
  title: "Componentes/Acciones/TextLink",
  component: TextLink,
  args: { href: "#", children: "Ver la trazabilidad completa" },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Editorial: Story = {};

export const Actual: Story = { args: { current: true, children: "Catálogo" } };

export const EnTexto: Story = {
  render: () => (
    <p className="max-w-prose font-text text-lg">
      Moscatel de Alejandría cultivado a 2.350 metros.{" "}
      <TextLink variant="inline" href="#">
        Consulta el lote en el explorador
      </TextLink>{" "}
      para ver cada paso registrado.
    </p>
  ),
};
