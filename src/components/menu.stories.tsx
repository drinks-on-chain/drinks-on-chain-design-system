import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Eye, LogOut, MoreHorizontal, Trash2 } from "lucide-react";
import { IconButton } from "./icon-button";
import { Menu } from "./menu";

const meta = {
  title: "Componentes/Overlays/Menu",
  component: Menu,
  args: {
    trigger: (
      <IconButton label="Acciones" variant="outline">
        <MoreHorizontal aria-hidden />
      </IconButton>
    ),
    align: "start",
    items: [
      { type: "label", label: "Lote SGR 2026" },
      { label: "Ver detalle", icon: <Eye aria-hidden />, href: "#detalle" },
      { label: "Exportar QR", icon: <Download aria-hidden />, shortcut: "⌘E" },
      { label: "Emitir (deshabilitado)", disabled: true },
      { type: "separator" },
      { label: "Archivar", icon: <Trash2 aria-hidden />, destructive: true },
      { label: "Cerrar sesión", icon: <LogOut aria-hidden /> },
    ],
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
