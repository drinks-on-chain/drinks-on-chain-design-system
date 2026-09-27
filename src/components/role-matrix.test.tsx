import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
