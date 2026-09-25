import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
  title: "Componentes/Estado/Badge",
  component: Badge,
  args: { children: "En fermentación", tone: "info", variant: "soft" },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["neutral", "accent", "success", "danger", "warning", "info"],
    },
    variant: { control: "inline-radio", options: ["soft", "strong"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const EstadosDeLote: Story = {
  render: () => (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Badge>Borrador</Badge>
        <Badge tone="info">En fermentación</Badge>
        <Badge tone="warning">Bloqueado</Badge>
        <Badge tone="success">Aprobado</Badge>
        <Badge tone="danger">Rechazado</Badge>
        <Badge tone="accent">Tokenizado</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="strong">Neutro</Badge>
        <Badge variant="strong" tone="success">
          Confirmada
        </Badge>
        <Badge variant="strong" tone="danger">
          Fallida
        </Badge>
        <Badge variant="strong" tone="accent" dot={false}>
          ✓ Apto para Singani D.O.
        </Badge>
        <Badge size="lg" tone="success">
          En cadena
        </Badge>
      </div>
    </div>
  ),
};
