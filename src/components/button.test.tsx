import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("es type=button por defecto y dispara onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Registrar ingreso</Button>);
    const button = screen.getByRole("button", { name: "Registrar ingreso" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respeta type=submit", () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("en carga marca aria-busy, se desactiva y no dispara clics", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Guardando
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Guardando" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("aplica las clases de variante y tamaño", () => {
    render(
      <Button variant="destructive" size="xl">
        Rechazar lote
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-danger");
    expect(button.className).toContain("min-h-14");
  });

  it("con asChild renderiza el hijo con los estilos del botón", () => {
    render(
      <Button asChild variant="secondary">
        <a href="/lotes">Ver lotes</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Ver lotes" });
    expect(link).toHaveAttribute("href", "/lotes");
    expect(link.className).toContain("border-border-strong");
  });
});
