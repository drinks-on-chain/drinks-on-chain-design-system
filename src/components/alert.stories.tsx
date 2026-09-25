import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./alert";
import { Button } from "./button";

const meta = {
  title: "Componentes/Feedback/Alert",
  component: Alert,
  args: {
    tone: "warning",
    title: "Lote inmovilizado por normativa",
    children: "Mínimo 6 meses de reposo. Faltan 142 días.",
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["neutral", "info", "success", "warning", "danger"] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tonos: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-3">
      <Alert tone="info" title="Conciliación">
        18.400 kg → 12.100 L vino base → 1.500 L corazón → 2.200 botellas.
      </Alert>
      <Alert tone="success" title="Trazabilidad completa">
        Todos los pasos tienen registro, responsable y fecha.
      </Alert>
      <Alert tone="warning" title="1 entrega pendiente de sincronizar">
        Se confirmará al recuperar la conexión.
      </Alert>
      <Alert
        tone="danger"
        title="La emisión falló"
        action={
          <Button size="sm" variant="secondary">
            Reintentar
          </Button>
        }
      >
        tx_underfunded
      </Alert>
      <Alert title="Sin icono" icon={false}>
        Aviso neutro.
      </Alert>
    </div>
  ),
};
