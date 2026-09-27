import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Button } from "./button";
import { ConfirmDialog } from "./confirm-dialog";
import { Modal, ModalClose } from "./modal";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const meta = {
  title: "Componentes/Overlays/ConfirmDialog",
  component: ConfirmDialog,
  args: {
    title: "¿Reenviar la invitación?",
    description: "Se envía un enlace nuevo a lucia@cintiviejo.test; el anterior deja de valer.",
    confirmLabel: "Reenviar",
    trigger: <Button variant="secondary">Reenviar invitación</Button>,
    onConfirm: fn(() => wait(800)),
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Abierto: Story = { args: { defaultOpen: true } };

/** Destructiva con confirmación escrita del identificador (03-backoffice, «Reglas»). */
export const DestructivaEscrita: Story = {
  args: {
    defaultOpen: true,
    destructive: true,
    title: "Revocar Destilería Cinti Viejo",
    description: "La bodega pierde el acceso al ERP de forma definitiva y se cierran sus sesiones.",
    confirmLabel: "Revocar bodega",
    confirmationText: "CINTI",
  },
};

export const ConError: Story = {
  args: {
    defaultOpen: true,
    title: "¿Reactivar la bodega?",
    confirmLabel: "Reactivar",
    onConfirm: fn(async () => {
      await wait(600);
      throw new Error("La bodega ya está activa (409 APPLICATION_INVALID_TRANSITION).");
    }),
  },
};

export const Cava: Story = { args: { defaultOpen: true }, globals: { theme: "cava" } };

/**
 * La confirmación abre otro diálogo: al cerrarse no le quita el foco y, cuando se cierra el
 * diálogo nuevo, el foco vuelve al disparador.
 */
function ConfirmThenModal() {
  const [done, setDone] = useState(false);
  return (
    <>
      <ConfirmDialog
        trigger={<Button variant="secondary">Aprobar solicitud</Button>}
        title="¿Aprobar la solicitud?"
        description="Se crea la bodega y se envía la invitación a la persona responsable."
        confirmLabel="Aprobar"
        onConfirm={() => setDone(true)}
      />
      <Modal
        open={done}
        onOpenChange={setDone}
        title="Solicitud aprobada"
        footer={
          <ModalClose asChild>
            <Button>Entendido</Button>
          </ModalClose>
        }
      >
        <p className="m-0 text-sm">La invitación se envió a lucia@cintiviejo.test.</p>
      </Modal>
    </>
  );
}

export const AbreOtroDialogo: Story = { render: () => <ConfirmThenModal /> };
