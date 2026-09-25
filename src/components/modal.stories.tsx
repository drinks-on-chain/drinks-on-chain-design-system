import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Modal, ModalClose } from "./modal";

const meta = {
  title: "Componentes/Overlays/Modal",
  component: Modal,
  args: {
    title: "Destino técnico de este lote",
    description: "Al elegir, la ruta contraria queda bloqueada.",
    trigger: <Button>Decidir destino</Button>,
    children: (
      <p className="m-0 text-sm text-fg-muted">
        La fermentación del Tanque 03 ha concluido. Elige si el lote pasa a crianza o a destilación.
      </p>
    ),
    footer: (
      <>
        <ModalClose asChild>
          <Button variant="secondary">Cancelar</Button>
        </ModalClose>
        <Button>Confirmar destino</Button>
      </>
    ),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AbiertoPorDefecto: Story = { args: { defaultOpen: true } };

function Decision() {
  const [choice, setChoice] = useState<"crianza" | "destilacion">("destilacion");
  return (
    <Modal
      defaultOpen
      dismissible={false}
      title="Destino técnico de este lote"
      description="Decisión obligatoria: al confirmar, la ruta contraria queda bloqueada."
      trigger={<Button>Abrir decisión</Button>}
      footer={
        <>
          <ModalClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </ModalClose>
          <ModalClose asChild>
            <Button>Confirmar destino</Button>
          </ModalClose>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["crianza", "A crianza", "Vino · barricas o botella"],
            ["destilacion", "A destilación", "Singani · alambique y reposo"],
          ] as const
        ).map(([value, title, detail]) => (
          <Card
            key={value}
            role="button"
            tabIndex={0}
            aria-pressed={choice === value}
            interactive
            selected={choice === value}
            onClick={() => setChoice(value)}
            className="grid min-h-28 gap-1 text-left"
          >
            <strong>{title}</strong>
            <span className="text-sm text-fg-subtle">{detail}</span>
          </Card>
        ))}
      </div>
    </Modal>
  );
}

export const DecisionObligatoria: Story = { render: () => <Decision /> };

export const Ancho: Story = {
  args: {
    size: "wide",
    title: "Configurar colección · Singani Gran Reserva 2026",
    description: "Destilería Cinti Viejo · lote lot_2026_sgr_01",
  },
};
