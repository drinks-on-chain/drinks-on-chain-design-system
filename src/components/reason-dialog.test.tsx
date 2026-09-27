import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ReasonDialog, validateReason } from "./reason-dialog";

describe("validateReason", () => {
  it("recorta y aplica 3–500 caracteres", () => {
    expect(validateReason("  ab  ")).toBe("too-short");
    expect(validateReason("abc")).toBeNull();
    expect(validateReason("x".repeat(501))).toBe("too-long");
    expect(validateReason("x".repeat(500))).toBeNull();
  });
});

describe("ReasonDialog", () => {
  it("enfoca el motivo obligatorio y lo describe", async () => {
    render(
      <ReasonDialog
        defaultOpen
        destructive
        title="Suspender Destilería Cinti Viejo"
        description="Se cierran las sesiones del ERP de la bodega."
        confirmLabel="Suspender"
        onConfirm={() => {}}
      />,
    );
    expect(
      await screen.findByRole("alertdialog", { name: "Suspender Destilería Cinti Viejo" }),
    ).toBeInTheDocument();
    const reason = screen.getByRole("textbox", { name: "Motivo" });
    await waitFor(() => expect(reason).toHaveFocus());
    expect(reason).toBeRequired();
    expect(reason).toHaveAttribute("maxLength", "500");
    expect(reason).toHaveAccessibleDescription(/Entre 3 y 500 caracteres/);
  });

  it("no envía un motivo demasiado corto y muestra el error", async () => {
    const onConfirm = vi.fn();
    render(<ReasonDialog defaultOpen title="Bloquear" onConfirm={onConfirm} />);
    const reason = screen.getByRole("textbox", { name: "Motivo" });
    await userEvent.type(reason, "no");
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(reason).toHaveAttribute("aria-invalid", "true");
    expect(reason).toHaveAccessibleDescription(/mínimo 3 caracteres/);
    expect(reason).toHaveFocus();
  });

  it("envía el motivo recortado y se cierra", async () => {
    const onConfirm = vi.fn(async () => {});
    render(<ReasonDialog defaultOpen title="Bloquear" onConfirm={onConfirm} />);
    await userEvent.type(screen.getByRole("textbox", { name: "Motivo" }), "  Uso indebido  ");
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onConfirm).toHaveBeenCalledWith("Uso indebido");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("muestra el error del servidor para el campo", () => {
    render(
      <ReasonDialog
        defaultOpen
        title="Bloquear"
        reasonError="El motivo es obligatorio"
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Motivo" })).toHaveAccessibleDescription(
      /El motivo es obligatorio/,
    );
  });
});
