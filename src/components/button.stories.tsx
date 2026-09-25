import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Plus } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "Componentes/Acciones/Button",
  component: Button,
  args: { children: "Registrar ingreso", variant: "primary", size: "md" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "tertiary", "destructive", "success"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl", "kiosk"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Registrar ingreso</Button>
      <Button variant="secondary">Cancelar</Button>
      <Button variant="tertiary">Ver historial</Button>
      <Button variant="destructive">Rechazar lote</Button>
      <Button variant="success">Aprobar lote</Button>
      <Button loading>Guardando</Button>
      <Button disabled>Deshabilitado</Button>
    </div>
  ),
};

export const Tamaños: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" size="sm">
        sm
      </Button>
      <Button variant="secondary">md</Button>
      <Button variant="secondary" size="lg">
        lg
      </Button>
      <Button size="xl">xl táctil</Button>
      <Button size="kiosk">kiosk</Button>
    </div>
  ),
};

export const ConIcono: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button iconStart={<Plus aria-hidden />}>Nuevo terroir</Button>
      <Button variant="secondary" iconEnd={<Download aria-hidden />}>
        Exportar QR
      </Button>
      <Button asChild variant="secondary">
        <a href="#enlace">Enlace con aspecto de botón</a>
      </Button>
      <Button block size="lg">
        Bloque
      </Button>
    </div>
  ),
};
