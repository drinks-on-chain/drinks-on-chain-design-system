import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { CommandPalette, type CommandPaletteGroup } from "./command-palette";

function makeGroups(onSelect = vi.fn()): CommandPaletteGroup[] {
  return [
    {
      heading: "Navegación",
      items: [
        { id: "dash", label: "Tablero", shortcut: "G T", onSelect: () => onSelect("dash") },
        {
          id: "apps",
          label: "Solicitudes de alta",
          keywords: ["bandeja"],
          onSelect: () => onSelect("apps"),
        },
        { id: "off", label: "Tokenización", disabled: true, onSelect: () => onSelect("off") },
      ],
    },
    {
      heading: "Bodegas",
      items: [{ id: "cinti", label: "Destilería Cinti Viejo", onSelect: () => onSelect("cinti") }],
    },
  ];
}

describe("CommandPalette", () => {
  it("se abre con Ctrl+K y con ⌘K, con el campo enfocado", async () => {
    render(<CommandPalette groups={makeGroups()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.keyboard("{Control>}k{/Control}");
    const dialog = await screen.findByRole("dialog", { name: "Buscador global" });
    expect(screen.getByRole("combobox", { name: "Buscar" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await userEvent.keyboard("{Meta>}k{/Meta}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("agrupa las opciones y muestra los atajos", async () => {
    render(<CommandPalette defaultOpen groups={makeGroups()} />);
    expect(screen.getByRole("group", { name: "Navegación" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Bodegas" })).toBeInTheDocument();
    expect(screen.getByText("G T")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("4 resultados");
  });

  it("filtra por etiqueta y palabras clave y anuncia el número de resultados", async () => {
    render(<CommandPalette defaultOpen groups={makeGroups()} />);
    await userEvent.type(screen.getByRole("combobox"), "bandeja");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: "Solicitudes de alta" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 resultado");
    await userEvent.clear(screen.getByRole("combobox"));
    await userEvent.type(screen.getByRole("combobox"), "zzz");
    expect(screen.getByRole("status")).toHaveTextContent("Sin resultados");
  });

  it("navega con flechas saltando las desactivadas y ejecuta con Enter", async () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <CommandPalette defaultOpen groups={makeGroups(onSelect)} onOpenChange={onOpenChange} />,
    );
    const input = screen.getByRole("combobox");
    const options = screen.getAllByRole("option");
    expect(input).toHaveAttribute("aria-activedescendant", options[0]!.id);
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    // "Tokenización" está desactivada: salta a la bodega.
    expect(input).toHaveAttribute("aria-activedescendant", options[3]!.id);
    await userEvent.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", options[0]!.id);
    await userEvent.keyboard("{ArrowUp}{Enter}");
    expect(onSelect).toHaveBeenCalledWith("cinti");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("devuelve el foco al elemento que lo tenía al cerrarse", async () => {
    render(
      <>
        <Button>Antes</Button>
        <CommandPalette groups={makeGroups()} />
      </>,
    );
    const before = screen.getByRole("button", { name: "Antes" });
    before.focus();
    await userEvent.keyboard("{Control>}k{/Control}");
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(before).toHaveFocus());
  });

  it("con filter={false} delega el filtrado y muestra la carga", async () => {
    const onQueryChange = vi.fn();
    render(
      <CommandPalette
        defaultOpen
        filter={false}
        loading
        groups={makeGroups()}
        onQueryChange={onQueryChange}
      />,
    );
    await userEvent.type(screen.getByRole("combobox"), "zzz");
    expect(onQueryChange).toHaveBeenLastCalledWith("zzz");
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(screen.getByRole("status")).toHaveTextContent("Buscando…");
  });

  it("hotkey={false} no registra el atajo", async () => {
    render(<CommandPalette hotkey={false} groups={makeGroups()} />);
    await userEvent.keyboard("{Control>}k{/Control}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
