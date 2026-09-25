import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, MoreHorizontal, ScanLine, X } from "lucide-react";
import { IconButton } from "./icon-button";

const meta = {
  title: "Componentes/Acciones/IconButton",
  component: IconButton,
  args: { label: "Notificaciones", children: <Bell aria-hidden /> },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variantes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton label="Acciones">
        <MoreHorizontal aria-hidden />
      </IconButton>
      <IconButton label="Cerrar" variant="outline">
        <X aria-hidden />
      </IconButton>
      <IconButton label="Escanear" variant="solid" round size="lg">
        <ScanLine aria-hidden />
      </IconButton>
      <IconButton label="Escanear" size="xl" variant="outline">
        <ScanLine aria-hidden />
      </IconButton>
    </div>
  ),
};
