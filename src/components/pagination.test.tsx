import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getPageItems, Pagination } from "./pagination";

describe("getPageItems", () => {
  it("lista todas las páginas si caben", () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("pone elipsis a ambos lados en el centro", () => {
    expect(getPageItems(10, 20)).toEqual([1, "ellipsis-start", 9, 10, 11, "ellipsis-end", 20]);
  });

  it("no pone elipsis al principio cerca del inicio", () => {
    expect(getPageItems(2, 20)).toEqual([1, 2, 3, "ellipsis-end", 20]);
    expect(getPageItems(4, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 20]);
  });
});

describe("Pagination", () => {
  it("calcula la página actual y el rango a partir de limit/offset", () => {
    render(<Pagination total={48} limit={20} offset={20} onOffsetChange={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Paginación" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Página 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("21–40 de 48")).toBeInTheDocument();
  });

  it("emite el nuevo offset al cambiar de página", async () => {
    const onOffsetChange = vi.fn();
    render(<Pagination total={48} limit={20} offset={0} onOffsetChange={onOffsetChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Página 3" }));
    expect(onOffsetChange).toHaveBeenLastCalledWith(40);
    await userEvent.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(onOffsetChange).toHaveBeenLastCalledWith(20);
  });

  it("desactiva anterior en la primera página y siguiente en la última", () => {
    const { rerender } = render(
      <Pagination total={48} limit={20} offset={0} onOffsetChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    rerender(<Pagination total={48} limit={20} offset={40} onOffsetChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Página siguiente" })).toBeDisabled();
    expect(screen.getByText("41–48 de 48")).toBeInTheDocument();
  });

  it("sin resultados muestra el texto vacío", () => {
    render(<Pagination total={0} limit={20} offset={0} onOffsetChange={() => {}} />);
    expect(screen.getByText("Sin resultados")).toBeInTheDocument();
  });

  it("admite etiquetas propias", () => {
    render(
      <Pagination
        total={4}
        limit={20}
        offset={0}
        onOffsetChange={() => {}}
        labels={{ range: (_from, _to, total) => `${total} bodegas`, nav: "Páginas de bodegas" }}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Páginas de bodegas" })).toBeInTheDocument();
    expect(screen.getByText("4 bodegas")).toBeInTheDocument();
  });
});
