import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AlertsFeed } from "./alerts-feed";

describe("AlertsFeed", () => {
  it("lista las alertas con el nivel para lectores de pantalla", () => {
    render(
      <AlertsFeed
        title="Alertas"
        items={[
          { id: "1", level: "CRITICAL", message: "Relayer sin fondos", time: "hace 5 min" },
          { id: "2", level: "INFO", message: "3 invitaciones caducan en 24 h" },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Alertas" })).toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Crítica: Relayer sin fondoshace 5 min");
    expect(items[1]).toHaveTextContent("Información: 3 invitaciones caducan en 24 h");
  });

  it("live usa role=log para anunciar las nuevas", () => {
    render(<AlertsFeed live items={[{ id: "1", level: "WARNING", message: "Aviso" }]} />);
    expect(screen.getByRole("log")).toHaveAttribute("aria-live", "polite");
  });

  it("estados de carga, vacío y error con reintento", async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<AlertsFeed items={[]} loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando alertas…");
    rerender(<AlertsFeed items={[]} />);
    expect(screen.getByText("Sin alertas pendientes.")).toBeInTheDocument();
    rerender(<AlertsFeed items={[]} error={{ onRetry }} />);
    expect(screen.getByRole("alert")).toHaveTextContent("No se pudieron cargar las alertas");
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
