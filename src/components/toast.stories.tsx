import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Toast, Toaster, toast } from "./toast";

const meta = {
  title: "Componentes/Feedback/Toast",
  component: Toast,
  args: { title: "Ingreso registrado · Tanque 03" },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Aspecto: Story = {};

export const Tonos: Story = {
  render: () => (
    <div className="grid justify-items-start gap-2">
      <Toast title="Ingreso registrado · Tanque 03" />
      <Toast tone="success" title="Emisión confirmada" description="Hash a91f…c2" />
      <Toast tone="warning" title="Sin conexión" description="La entrega se sincronizará." />
      <Toast tone="danger" title="La emisión falló" description="tx_underfunded" />
    </div>
  ),
};

export const ConToaster: Story = {
  render: () => (
    <>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast({ title: "Ingreso registrado · Tanque 03" })}>
          Notificar
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast({
              tone: "danger",
              title: "La emisión falló",
              description: "tx_underfunded",
              action: { label: "Reintentar", onClick: () => {} },
            })
          }
        >
          Notificar error
        </Button>
      </div>
      <Toaster />
    </>
  ),
};
