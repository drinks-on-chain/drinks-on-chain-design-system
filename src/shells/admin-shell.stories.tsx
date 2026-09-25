import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell } from "lucide-react";
import { fn } from "storybook/test";
import { Badge } from "../components/badge";
import { IconButton } from "../components/icon-button";
import { adminNavigation } from "../stories/navigation";
import { AdminShell } from "./admin-shell";

const meta = {
  title: "Shells/AdminShell",
  component: AdminShell,
  parameters: { layout: "fullscreen" },
  args: {
    navigation: adminNavigation,
    currentPath: "/bodegas",
    user: { name: "Ana Gutiérrez", role: "Gestora · admin_plataforma" },
    search: { onOpen: fn(), placeholder: "Buscar bodega, lote, usuario, ticket…" },
    notifications: (
      <>
        <IconButton label="Notificaciones">
          <Bell aria-hidden />
        </IconButton>
        <Badge tone="warning">2 alertas</Badge>
      </>
    ),
    children: <h1 className="m-0 font-display text-3xl font-medium">Bodegas</h1>,
  },
} satisfies Meta<typeof AdminShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Escritorio: Story = {};

export const Movil: Story = { globals: { viewport: { value: "sm375", isRotated: false } } };
