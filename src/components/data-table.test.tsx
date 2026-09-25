import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { compareValues, DataTable, type DataTableColumn } from "./data-table";

interface Row {
  id: string;
  lot: string;
  bottles: number | null;
}

const rows: Row[] = [
  { id: "a", lot: "Tannat Reserva 24", bottles: 2200 },
  { id: "b", lot: "SGR 2026 · 01", bottles: null },
  { id: "c", lot: "Moscatel Blanco 25", bottles: 1480 },
];

const columns: DataTableColumn<Row>[] = [
  { id: "lot", header: "Lote", accessor: "lot", sortable: true },
  { id: "bottles", header: "Botellas", accessor: "bottles", numeric: true, sortable: true },
];

function firstColumn() {
  const body = screen.getAllByRole("rowgroup")[1]!;
  return within(body)
    .getAllByRole("row")
    .map((row) => within(row).getAllByRole("cell")[0]!.textContent);
}

describe("DataTable", () => {
  it("renderiza cabeceras y filas en el orden recibido", () => {
    render(<DataTable data={rows} columns={columns} getRowId={(row) => row.id} />);
    expect(screen.getByRole("columnheader", { name: /Lote/ })).toHaveAttribute("aria-sort", "none");
    expect(firstColumn()).toEqual(["Tannat Reserva 24", "SGR 2026 · 01", "Moscatel Blanco 25"]);
  });

  it("ordena asc → desc → sin orden al pulsar la cabecera", async () => {
    render(<DataTable data={rows} columns={columns} getRowId={(row) => row.id} />);
    const header = screen.getByRole("columnheader", { name: /Lote/ });
    const button = within(header).getByRole("button");

    await userEvent.click(button);
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(firstColumn()).toEqual(["Moscatel Blanco 25", "SGR 2026 · 01", "Tannat Reserva 24"]);

    await userEvent.click(button);
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(firstColumn()).toEqual(["Tannat Reserva 24", "SGR 2026 · 01", "Moscatel Blanco 25"]);

    await userEvent.click(button);
    expect(header).toHaveAttribute("aria-sort", "none");
    expect(firstColumn()).toEqual(["Tannat Reserva 24", "SGR 2026 · 01", "Moscatel Blanco 25"]);
  });

  it("ordena números con los vacíos al final", async () => {
    render(<DataTable data={rows} columns={columns} getRowId={(row) => row.id} />);
    await userEvent.click(
      within(screen.getByRole("columnheader", { name: /Botellas/ })).getByRole("button"),
    );
    expect(firstColumn()).toEqual(["Moscatel Blanco 25", "Tannat Reserva 24", "SGR 2026 · 01"]);
  });

  it("con manualSorting informa del orden sin reordenar", async () => {
    const onSortChange = vi.fn();
    render(
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        manualSorting
        onSortChange={onSortChange}
      />,
    );
    await userEvent.click(
      within(screen.getByRole("columnheader", { name: /Lote/ })).getByRole("button"),
    );
    expect(onSortChange).toHaveBeenCalledWith({ columnId: "lot", direction: "asc" });
    expect(firstColumn()).toEqual(["Tannat Reserva 24", "SGR 2026 · 01", "Moscatel Blanco 25"]);
  });

  it("selecciona filas y todas con la casilla de cabecera", async () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    const rowBoxes = screen.getAllByRole("checkbox", { name: "Seleccionar fila" });
    await userEvent.click(rowBoxes[0]!);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["a"]);
    await userEvent.click(screen.getByRole("checkbox", { name: "Seleccionar todas las filas" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["a", "b", "c"]);
  });

  it("muestra el estado vacío y el de carga", () => {
    const { rerender } = render(
      <DataTable data={[]} columns={columns} getRowId={(row) => row.id} />,
    );
    expect(screen.getByText("Sin resultados")).toBeInTheDocument();
    rerender(<DataTable data={rows} columns={columns} getRowId={(row) => row.id} loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando…");
    expect(screen.queryByText("Tannat Reserva 24")).not.toBeInTheDocument();
  });
});

describe("compareValues", () => {
  it("compara texto en español con números naturales", () => {
    expect(compareValues("Lote 2", "Lote 10")).toBeLessThan(0);
    expect(compareValues("árbol", "Bodega")).toBeLessThan(0);
  });
});
