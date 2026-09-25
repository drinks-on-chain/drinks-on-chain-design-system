import type { Meta, StoryObj } from "@storybook/react-vite";
import { QRCode } from "./qr-code";

const meta = {
  title: "Componentes/Datos/QRCode",
  component: QRCode,
  args: {
    value: "https://app.drinksonchain.test/b/SGR26CINTI-0417",
    label: "Código de la botella 0417",
  },
} satisfies Meta<typeof QRCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tamaños: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-4">
      <QRCode {...args} size={96} />
      <QRCode {...args} size={168} />
      <QRCode {...args} size={240} level="H" margin={4} />
    </div>
  ),
};
