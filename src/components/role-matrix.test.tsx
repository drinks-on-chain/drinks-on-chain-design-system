import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RoleMatrix, type RoleMatrixCapability } from "./role-matrix";

const capabilities: RoleMatrixCapability[] = [
  {
    key: "platform.users",
    label: "Usuarios internos",
    roles: { ADMIN: "FULL", OPERATIONS: "NONE", SUPPORT: "NONE" },
  },
  {
    key: "platform.settings",
    label: "Configuración",
    description: "Parámetros de trazabilidad y equipo",
    roles: { ADMIN: "FULL", OPERATIONS: "READ", SUPPORT: "READ" },
  },
  { key: "org.team", label: "Equipo de una bodega", roles: { ADMIN: "FULL", OWNER: "OWN" } },
];

const roles = [
  { key: "ADMIN", label: "Admin" },
  { key: "OPERATIONS", label: "Operaciones" },
  { key: "SUPPORT", label: "Soporte" },
  { key: "OWNER", label: "Dueño" },
];

describe("RoleMatrix", () => {
  it("es una tabla con cabeceras de fila y de columna", () => {
    render(<RoleMatrix capabilities={capabilities} roles={roles} />);
    const table = screen.getByRole("table", { name: "Permisos por rol" });
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((th) => th.textContent),
    ).toEqual(["Capacidad", "Admin", "Operaciones", "Soporte", "Dueño"]);
    expect(within(table).getByRole("rowheader", { name: /Configuración/ })).toBeInTheDocument();
  });

  it("cada celda tiene texto legible, también NONE y los roles ausentes", () => {
    render(<RoleMatrix capabilities={capabilities} roles={roles} legend={false} />);
    const row = screen.getByRole("row", { name: /Configuración/ });
    const cells = within(row).getAllByRole("cell");
    expect(cells.map((cell) => cell.textContent)).toEqual([
      "Completo",
      "Lectura",
      "Lectura",
      "—Sin acceso",
    ]);
    const team = within(screen.getByRole("row", { name: /Equipo de una bodega/ })).getAllByRole(
      "cell",
    );
    expect(team[3]).toHaveTextContent("Solo lo propio");
    expect(team[1]).toHaveTextContent("Sin acceso");
  });

  it("deduce las columnas si no se pasan roles y muestra la leyenda", () => {
    render(<RoleMatrix capabilities={capabilities} />);
    expect(screen.getByRole("columnheader", { name: "OPERATIONS" })).toBeInTheDocument();
    expect(screen.getByLabelText("Leyenda de niveles")).toHaveTextContent("Solo lo propio");
  });

  describe("contenedor desplazable", () => {
    afterEach(() => vi.restoreAllMocks());

    function mockWidths(scrollWidth: number, clientWidth: number) {
      vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(scrollWidth);
      vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(clientWidth);
    }

    it("si desborda, es una región enfocable con el nombre de la tabla (scrollable-region-focusable)", async () => {
      mockWidths(900, 400);
      render(
        <RoleMatrix capabilities={capabilities} roles={roles} caption="Permisos del equipo" />,
      );
      const region = await screen.findByRole("region", { name: "Permisos del equipo" });
      expect(region).toHaveAttribute("tabindex", "0");
      expect(region).toContainElement(screen.getByRole("table"));
      expect(region.className).toContain("focus-visible:outline-2");
      await userEvent.tab();
      expect(region).toHaveFocus();
    });

    it("si cabe, no añade una parada de tabulación", () => {
      mockWidths(400, 400);
      render(<RoleMatrix capabilities={capabilities} roles={roles} />);
      expect(screen.queryByRole("region")).not.toBeInTheDocument();
      expect(screen.getByRole("table").parentElement).not.toHaveAttribute("tabindex");
    });
  });
});
