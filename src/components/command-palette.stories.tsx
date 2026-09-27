import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Building2,
  FileClock,
  Inbox,
  LayoutDashboard,
  Plus,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";
import { formatHotkey } from "../lib/use-hotkey";
import { Button } from "./button";
import { CommandPalette, type CommandPaletteGroup } from "./command-palette";

const groups: CommandPaletteGroup[] = [
  {
    heading: "Ir a",
    items: [
      { id: "dash", label: "Tablero", icon: <LayoutDashboard />, shortcut: "G T", onSelect: fn() },
      {
        id: "apps",
        label: "Solicitudes de alta",
        icon: <Inbox />,
        keywords: ["bandeja", "altas"],
        shortcut: "G S",
        onSelect: fn(),
      },
      { id: "wineries", label: "Bodegas", icon: <Building2 />, shortcut: "G B", onSelect: fn() },
      { id: "users", label: "Usuarios internos", icon: <Users />, onSelect: fn() },
      { id: "settings", label: "Configuración", icon: <Settings />, onSelect: fn() },
      { id: "audit", label: "Bitácora", icon: <ScrollText />, onSelect: fn() },
    ],
  },
  {
    heading: "Acciones",
    items: [
      { id: "new", label: "Alta directa de bodega", icon: <Plus />, onSelect: fn() },
      {
        id: "verify",
        label: "Verificar la cadena de la bitácora",
        icon: <FileClock />,
        disabled: true,
        onSelect: fn(),
      },
    ],
  },
  {
    heading: "Bodegas",
    items: [
      {
        id: "w-cinti",
        label: "Destilería Cinti Viejo",
        description: "Activa · CINTI · Cinti",
        onSelect: fn(),
      },
      {
        id: "w-cala",
        label: "Bodega Altos de Calamuchita",
        description: "Suspendida · ALTCA · Tarija",
        onSelect: fn(),
      },
    ],
  },
];

const meta = {
  title: "Componentes/Overlays/CommandPalette",
  component: CommandPalette,
  args: { groups, placeholder: "Buscar bodega, usuario, ajuste…" },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Abierta: Story = { args: { defaultOpen: true } };

function WithTrigger(args: Story["args"]) {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid justify-items-start gap-2 text-sm text-fg-muted">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Abrir buscador · {formatHotkey("mod+k")}
      </Button>
      <p className="m-0">También con {formatHotkey("mod+k")} desde cualquier sitio.</p>
      <CommandPalette groups={groups} {...args} open={open} onOpenChange={setOpen} />
    </div>
  );
}

export const ConAtajo: Story = { render: (args) => <WithTrigger {...args} /> };

export const Cargando: Story = {
  args: { defaultOpen: true, loading: true, filter: false, groups: [] },
};

export const Cava: Story = { args: { defaultOpen: true }, globals: { theme: "cava" } };
