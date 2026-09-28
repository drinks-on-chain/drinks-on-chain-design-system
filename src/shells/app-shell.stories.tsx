import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogOut, Plus, User } from "lucide-react";
import { action } from "storybook/actions";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { EmptyState } from "../components/empty-state";
import type { LinkComponentProps } from "../lib/link";
import { erpNavigation } from "../stories/navigation";
import { AppShell } from "./app-shell";

const navigate = action("navegar");

/** Como `next/link`: navega en el cliente sin recargar (aquí lo registra en Actions). */
function RouterLink({ onClick, ...props }: LinkComponentProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
        navigate(props.href);
      }}
    />
  );
}

const meta = {
  title: "Shells/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
  args: {
    navigation: erpNavigation,
    currentPath: "/vendimia/pesaje",
    user: { name: "Lucía Rojas", role: "Enóloga · Cinti Viejo" },
    userMenu: [
      { label: "Mi perfil", icon: <User />, href: "/perfil" },
      { type: "separator" },
      { label: "Cerrar sesión", icon: <LogOut />, onSelect: action("cerrar sesión") },
    ],
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

/** Con `linkComponent` (en Next, `Link` de `next/link`): marca, navegación, migas y menú de usuario. */
export const EnlacesDelRouter: Story = { args: { linkComponent: RouterLink, brandHref: "/" } };

export const Colapsada: Story = { args: { defaultCollapsed: true } };

export const Tablet: Story = { globals: { viewport: { value: "md768", isRotated: false } } };

export const Movil: Story = { globals: { viewport: { value: "sm375", isRotated: false } } };
