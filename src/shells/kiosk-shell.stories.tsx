import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/button";
import { KioskShell } from "./kiosk-shell";

const meta = {
  title: "Shells/KioskShell",
  component: KioskShell,
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "lg1024", isRotated: false } },
  args: {
    branch: "Licorería La Cava · Tarija",
    context: "Juan P. · turno abierto",
    clock: "10:14",
    footer: (
      <Button variant="secondary" size="kiosk">
        Ver historial de hoy · 7 entregas
      </Button>
    ),
    children: (
      <div className="grid place-items-center p-6 text-center text-2xl text-fg-muted">
        Una acción por pantalla
      </div>
    ),
  },
} satisfies Meta<typeof KioskShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnLinea: Story = {};

export const SinConexion: Story = { args: { online: false } };
