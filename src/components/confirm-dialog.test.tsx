import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { ConfirmDialog } from "./confirm-dialog";

describe("ConfirmDialog", () => {
  it("es un alertdialog con título y descripción; el foco empieza en Cancelar", async () => {
    render(
      <ConfirmDialog
        trigger={<Button>Reenviar</Button>}
        title="¿Reenviar la invitación?"
        description="El enlace anterior deja de valer."
        onConfirm={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Reenviar" }));
    const dialog = await screen.findByRole("alertdialog", { name: "¿Reenviar la invitación?" });
    expect(dialog).toHaveAccessibleDescription("El enlace anterior deja de valer.");
    await waitFor(() => expect(screen.getByRole("button", { name: "Cancelar" })).toHaveFocus());
  });

  it("confirma, espera la promesa y cierra devolviendo el foco", async () => {
    let resolve: () => void = () => {};
    const onConfirm = vi.fn(() => new Promise<void>((done) => (resolve = done)));
    render(
      <ConfirmDialog
        trigger={<Button>Reenviar</Button>}
        title="¿Reenviar?"
        onConfirm={onConfirm}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Reenviar" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("button", { name: "Confirmar" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Confirmar" })).toHaveAttribute("aria-busy", "true");
    // Mientras la acción está en curso, Esc no cierra.
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    resolve();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("muestra el error si la acción falla y sigue abierto", async () => {
    render(
      <ConfirmDialog
        defaultOpen
        title="¿Reactivar la bodega?"
        onConfirm={() => Promise.reject(new Error("La bodega ya está activa"))}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("La bodega ya está activa");
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("confirmación escrita: el botón se activa al escribir el identificador", async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        defaultOpen
        destructive
        title="Revocar la bodega"
        confirmLabel="Revocar"
        confirmationText="CINTI"
        onConfirm={onConfirm}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Escribe «CINTI» para confirmar" });
    await waitFor(() => expect(input).toHaveFocus());
    const confirm = screen.getByRole("button", { name: "Revocar" });
    expect(confirm).toBeDisabled();
    await userEvent.type(input, "CINT");
    expect(confirm).toBeDisabled();
    await userEvent.type(input, "I");
    expect(confirm).toBeEnabled();
    await userEvent.keyboard("{Enter}");
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("Esc cancela sin ejecutar la acción", async () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        defaultOpen
        title="¿Seguro?"
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
      />,
    );
    await screen.findByRole("alertdialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
