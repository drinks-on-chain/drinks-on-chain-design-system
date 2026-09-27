import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BulkActionBar } from "./bulk-action-bar";

describe("BulkActionBar", () => {
  it("es una región con el recuento anunciado y las acciones", async () => {
    const onClear = vi.fn();
    render(
      <BulkActionBar count={2} onClear={onClear}>
        <button type="button">Exportar</button>
      </BulkActionBar>,
    );
    const region = screen.getByRole("region", { name: "Acciones masivas" });
    expect(screen.getByText("2 seleccionadas")).toHaveAttribute("aria-live", "polite");
    expect(region).toContainElement(screen.getByRole("button", { name: "Exportar" }));
    await userEvent.click(screen.getByRole("button", { name: "Quitar selección" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("singular y sin anuncio propio", () => {
    render(<BulkActionBar count={1} announce={false} />);
    expect(screen.getByText("1 seleccionada")).not.toHaveAttribute("aria-live");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
