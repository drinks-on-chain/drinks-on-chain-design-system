import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { Modal, ModalClose } from "./modal";

function renderModal(props: Partial<Parameters<typeof Modal>[0]> = {}) {
  return render(
    <Modal
      title="Destino técnico de este lote"
      description="Al elegir, la ruta contraria queda bloqueada."
      trigger={<Button>Decidir destino</Button>}
      footer={
        <>
          <ModalClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </ModalClose>
          <Button>Confirmar destino</Button>
        </>
      }
      {...props}
    >
      <p>Contenido</p>
    </Modal>,
  );
}

describe("Modal", () => {
  it("se abre desde el disparador como diálogo modal con nombre y descripción", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Decidir destino" }));
    const dialog = await screen.findByRole("dialog", { name: "Destino técnico de este lote" });
    expect(dialog).toHaveAccessibleDescription("Al elegir, la ruta contraria queda bloqueada.");
  });

  it("atrapa el foco dentro del diálogo al tabular", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Decidir destino" }));
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    await userEvent.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it("Esc cierra, avisa con onOpenChange y devuelve el foco al disparador", async () => {
    const onOpenChange = vi.fn();
    renderModal({ onOpenChange });
    const trigger = screen.getByRole("button", { name: "Decidir destino" });
    await userEvent.click(trigger);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(trigger).toHaveFocus();
  });

  it("el botón Cerrar lleva la etiqueta en español y cierra", async () => {
    renderModal({ defaultOpen: true });
    await userEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("con dismissible={false} Esc no cierra y no hay botón Cerrar", async () => {
    renderModal({ defaultOpen: true, dismissible: false });
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cerrar" })).not.toBeInTheDocument();
  });
});
