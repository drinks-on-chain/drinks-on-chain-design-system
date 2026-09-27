import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { AlertsFeed, type AlertsFeedItem } from "./alerts-feed";
import { Button } from "./button";
import { Card } from "./card";

const items: AlertsFeedItem[] = [
  {
    id: "a1",
    level: "CRITICAL",
    message: (
      <>
        Bodega Altos de Calamuchita · <strong>5 códigos TOTP fallidos</strong> en la cuenta de su
        dueño
      </>
    ),
    time: "hace 4 min",
    meta: "se bloqueó el acceso 15 min",
    action: (
      <Button size="sm" variant="secondary">
        Ver bitácora
      </Button>
    ),
  },
  {
    id: "a2",
    level: "WARNING",
    message: "3 invitaciones de dueño caducan en las próximas 24 h",
    time: "hace 1 h",
    action: (
      <Button size="sm" variant="secondary">
        Reenviar
      </Button>
    ),
  },
  {
    id: "a3",
    level: "INFO",
    message: "Nueva solicitud de alta: Viñedos del Guadalquivir",
    time: "hace 2 h",
    meta: "sin asignar",
    action: <Button size="sm">Tomar</Button>,
  },
  {
    id: "a4",
    tone: "success",
    message: "Destilería Cinti Viejo aceptó la invitación y está activa (prefijo CINTI)",
    time: "ayer",
  },
];

const meta = {
  title: "Componentes/Datos/AlertsFeed",
  component: AlertsFeed,
  args: {
    items,
    title: "Alertas",
    headerAction: (
      <Button variant="tertiary" size="sm" onClick={fn()}>
        Ver todas
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <Card className="max-w-2xl text-sm">
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof AlertsFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Cargando: Story = { args: { loading: true } };

export const Vacio: Story = { args: { items: [] } };

export const ConError: Story = { args: { error: { onRetry: fn() } } };

export const Cava: Story = { globals: { theme: "cava" } };
