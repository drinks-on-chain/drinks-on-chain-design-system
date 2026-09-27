import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { FilterBar, type ActiveFilter } from "./filter-bar";
import { Input } from "./input";

const initial: ActiveFilter[] = [
  { id: "status", label: "Estado", value: "Activa" },
  { id: "region", label: "Región", value: "Tarija" },
  { id: "category", label: "Categoría", value: "Bodega" },
];

function Harness({ onClearAll }: { onClearAll?: () => void }) {
  const [filters, setFilters] = useState(initial);
  return (
    <FilterBar
      filters={filters}
      onRemove={(id) => setFilters((current) => current.filter((filter) => filter.id !== id))}
      onClearAll={() => {
        onClearAll?.();
        setFilters([]);
      }}
      resultCount={`${filters.length * 10} bodegas`}
    >
      <Input size="sm" aria-label="Buscar bodega" />
    </FilterBar>
  );
}

describe("FilterBar", () => {
  it("muestra los controles y los chips de filtros activos", () => {
    render(<Harness />);
    expect(screen.getByRole("region", { name: "Filtros" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Buscar bodega" })).toBeInTheDocument();
    const chips = within(screen.getByRole("list", { name: "Filtros activos" })).getAllByRole(
      "listitem",
    );
    expect(chips.map((chip) => chip.textContent)).toEqual([
      "Estado:Activa",
      "Región:Tarija",
      "Categoría:Bodega",
    ]);
    expect(screen.getByText("30 bodegas")).toHaveAttribute("aria-live", "polite");
  });

  it("quitar un chip con el teclado lleva el foco al siguiente", async () => {
    render(<Harness />);
    screen.getByRole("button", { name: "Quitar filtro Región: Tarija" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.queryByText("Tarija")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quitar filtro Categoría: Bodega" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Quitar filtro Estado: Activa" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("region", { name: "Filtros" })).toHaveFocus();
  });

  it("Limpiar filtros los quita todos", async () => {
    const onClearAll = vi.fn();
    render(<Harness onClearAll={onClearAll} />);
    await userEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("list", { name: "Filtros activos" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Limpiar filtros" })).not.toBeInTheDocument();
  });
});
