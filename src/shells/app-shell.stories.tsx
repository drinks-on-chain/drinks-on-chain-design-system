import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { EmptyState } from "../components/empty-state";
import { erpNavigation } from "../stories/navigation";
import { AppShell } from "./app-shell";

const meta = {
  title: "Shells/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
  args: {
    navigation: erpNavigation,
    currentPath: "/vendimia/pesaje",
    user: { name: "Lucía Rojas", role: "Enóloga · Cinti Viejo" },
    userMenu: [{ label: "Mi perfil" }, { type: "separator" }, { label: "Cerrar sesión" }],
    breadcrumbs: [
      { label: "Cinti Viejo", href: "/" },
      { label: "Vendimia", href: "/vendimia" },
      { label: "Pesaje" },
    ],
    topbarActions: (
      <>
        <Badge tone="info" className="max-sm:hidden">
          3 tareas hoy
        </Badge>
        <Button iconStart={<Plus aria-hidden />}>Registrar ingreso</Button>
      </>
    ),
    children: (
      <>
        <h1 className="mt-0 mb-5 font-display text-3xl font-medium">Pesaje</h1>
        <EmptyState
          title="Sin ingresos hoy"
          description="Registra el primer ingreso de uva de la jornada."
          action={<Button size="sm">Registrar ingreso</Button>}
        />
      </>
    ),
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Escritorio: Story = {};

export const Colapsada: Story = { args: { defaultCollapsed: true } };

export const Tablet: Story = { globals: { viewport: { value: "md768", isRotated: false } } };

export const Movil: Story = { globals: { viewport: { value: "sm375", isRotated: false } } };
