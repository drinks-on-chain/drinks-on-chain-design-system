import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./button";
import { KeyValueList } from "./key-value-list";
import { ReasonDialog } from "./reason-dialog";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const meta = {
  title: "Componentes/Overlays/ReasonDialog",
  component: ReasonDialog,
  args: {
    title: "Suspender Destilería Cinti Viejo",
    description:
      "La bodega no podrá usar el ERP hasta que se reactive. Se cierran sus sesiones y se avisa al dueño por correo.",
    confirmLabel: "Suspender",
    destructive: true,
    trigger: <Button variant="destructive">Suspender bodega</Button>,
    onConfirm: fn(() => wait(800)),
  },
} satisfies Meta<typeof ReasonDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Abierto: Story = { args: { defaultOpen: true } };

/** Acción no destructiva sobre terceros: cambiar el rol de un miembro de una bodega. */
export const NoDestructiva: Story = {
  args: {
    defaultOpen: true,
    destructive: false,
    title: "Cambiar el rol de Lucía Rojas",
    description: "Se avisará a la dueña de la bodega.",
    confirmLabel: "Cambiar rol",
    placeholder: "Por qué se cambia el rol…",
    children: (
      <KeyValueList
        items={[
          { term: "Rol actual", value: "Enóloga" },
          { term: "Rol nuevo", value: "Operaria de bodega" },
        ]}
      />
    ),
  },
};

export const ErrorDelServidor: Story = {
  args: { defaultOpen: true, reasonError: "El motivo es obligatorio (422 · reason)." },
};

export const Cava: Story = { args: { defaultOpen: true }, globals: { theme: "cava" } };
