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

describe("DataTable · Backoffice (0.3)", () => {
  it("muestra el error con reintento en el cuerpo", async () => {
    const onRetry = vi.fn();
    render(
      <DataTable data={rows} columns={columns} getRowId={(row) => row.id} error={{ onRetry }} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("No se pudieron cargar los datos");
    expect(screen.queryByText("Tannat Reserva 24")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("barra de acciones masivas con la selección y Quitar selección", async () => {
    const onSuspend = vi.fn();
    render(
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        selectable
        bulkActions={(ids, clear) => (
          <button
            type="button"
            onClick={() => {
              onSuspend(ids);
              clear();
            }}
          >
            Suspender
          </button>
        )}
      />,
    );
    expect(screen.queryByRole("region", { name: "Acciones masivas" })).not.toBeInTheDocument();
    const boxes = screen.getAllByRole("checkbox", { name: "Seleccionar fila" });
    boxes[0]!.focus();
    await userEvent.keyboard(" ");
    await userEvent.click(boxes[2]!);
    const bar = screen.getByRole("region", { name: "Acciones masivas" });
    expect(bar).toHaveTextContent("2 seleccionadas");
    await userEvent.click(within(bar).getByRole("button", { name: "Suspender" }));
    expect(onSuspend).toHaveBeenCalledWith(["a", "c"]);
    expect(screen.queryByRole("region", { name: "Acciones masivas" })).not.toBeInTheDocument();
  });

  it("paginación limit/offset conectada", async () => {
    const onOffsetChange = vi.fn();
    render(
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        pagination={{ total: 48, limit: 20, offset: 0, onOffsetChange }}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Paginación" });
    expect(nav).toHaveTextContent("1–20 de 48");
    await userEvent.click(within(nav).getByRole("button", { name: "Página siguiente" }));
    expect(onOffsetChange).toHaveBeenCalledWith(20);
  });

  it("filtro por columna en un panel desde la cabecera", async () => {
    const filtered: DataTableColumn<Row>[] = [
      {
        ...columns[0]!,
        filter: (
          <label>
            Contiene <input />
          </label>
        ),
        filterActive: true,
      },
      columns[1]!,
    ];
    render(<DataTable data={rows} columns={filtered} getRowId={(row) => row.id} />);
    const trigger = screen.getByRole("button", { name: "Filtrar por Lote (filtro aplicado)" });
    await userEvent.click(trigger);
    expect(await screen.findByRole("textbox", { name: "Contiene" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("textbox", { name: "Contiene" })).not.toBeInTheDocument();
  });
});

describe("compareValues", () => {
  it("compara texto en español con números naturales", () => {
    expect(compareValues("Lote 2", "Lote 10")).toBeLessThan(0);
    expect(compareValues("árbol", "Bodega")).toBeLessThan(0);
  });
});
