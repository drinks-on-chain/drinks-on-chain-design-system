import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Building2, Inbox, LayoutDashboard, LogOut, ScrollText, User } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";
import { Badge } from "../components/badge";
import { IconButton } from "../components/icon-button";
import { OrganizationSwitcher } from "../components/organization-switcher";
import { adminNavigation } from "../stories/navigation";
import { AdminShell } from "./admin-shell";

function Organizations() {
  const [active, setActive] = useState("platform");
  return (
    <OrganizationSwitcher
      activeId={active}
      onChange={setActive}
      organizations={[
        { id: "platform", name: "Drinks on Chain", description: "Plataforma · ADMIN" },
        { id: "w1", name: "Destilería Cinti Viejo", description: "Bodega · OWNER" },
      ]}
    />
  );
}

const meta = {
  title: "Shells/AdminShell",
  component: AdminShell,
  parameters: { layout: "fullscreen" },
  args: {
    navigation: adminNavigation,
    currentPath: "/bodegas",
    user: { name: "Ana Gutiérrez", role: "Gestora · admin_plataforma" },
    userMenu: [
      { label: "Mi perfil", icon: <User />, onSelect: fn() },
      { type: "separator" },
      { label: "Cerrar sesión", icon: <LogOut />, onSelect: fn() },
    ],
    search: { placeholder: "Buscar bodega, lote, usuario, ticket…" },
    commandPalette: {
      placeholder: "Buscar bodega, usuario, ajuste…",
      groups: [
        {
          heading: "Ir a",
          items: [
            { id: "dash", label: "Tablero", icon: <LayoutDashboard />, onSelect: fn() },
            { id: "apps", label: "Solicitudes de alta", icon: <Inbox />, onSelect: fn() },
            { id: "wineries", label: "Bodegas", icon: <Building2 />, onSelect: fn() },
            { id: "audit", label: "Bitácora", icon: <ScrollText />, onSelect: fn() },
          ],
        },
      ],
    },
    organizationSwitcher: <Organizations />,
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

/** Buscador (⌘K / Ctrl+K, "/") con la paleta integrada, organización y menú de usuario. */
export const Escritorio: Story = {};

/** Compatibilidad 0.2: la app abre su propia paleta con `search.onOpen`. */
export const PaletaDeLaApp: Story = {
  args: { commandPalette: undefined, search: { onOpen: fn(), placeholder: "Buscar…" } },
};

export const Movil: Story = { globals: { viewport: { value: "sm375", isRotated: false } } };
