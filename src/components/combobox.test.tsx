import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Combobox, type ComboboxOption } from "./combobox";
import { Field } from "./field";

const wineries: ComboboxOption[] = [
  { value: "cinti", label: "Destilería Cinti Viejo", description: "Cinti · Camargo" },
  { value: "calamuchita", label: "Bodega Altos de Calamuchita", description: "Tarija" },
  { value: "guadalquivir", label: "Viñedos del Guadalquivir", description: "Tarija" },
  { value: "uriondo", label: "Casa Uriondo", disabled: true },
];

describe("Combobox", () => {
  it("expone el patrón combobox con etiqueta del Field", async () => {
    render(
      <Field label="Bodega">
        <Combobox options={wineries} />
      </Field>,
    );
    const input = screen.getByRole("combobox", { name: "Bodega" });
    expect(input).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox", { name: "Bodega" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("filtra sin tildes y elige con flechas y Enter", async () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Bodega" options={wineries} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "vinedos");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(await screen.findByRole("status")).toHaveTextContent("1 resultado");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(
      "guadalquivir",
      expect.objectContaining({ label: "Viñedos del Guadalquivir" }),
    );
    expect(input).toHaveValue("Viñedos del Guadalquivir");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("aria-activedescendant sigue a las flechas y salta las opciones desactivadas", async () => {
    render(<Combobox aria-label="Bodega" options={wineries} />);
    const input = screen.getByRole("combobox");
    input.focus();
    await userEvent.keyboard("{ArrowDown}");
    const first = screen.getAllByRole("option")[0]!;
    expect(input).toHaveAttribute("aria-activedescendant", first.id);
    await userEvent.keyboard("{ArrowUp}");
    // Vuelve al final saltando "Casa Uriondo" (desactivada).
    const third = screen.getAllByRole("option")[2]!;
    expect(input).toHaveAttribute("aria-activedescendant", third.id);
  });

  it("Esc cierra la lista y vuelve a la etiqueta elegida", async () => {
    render(<Combobox aria-label="Bodega" options={wineries} defaultValue="cinti" />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("Destilería Cinti Viejo");
    await userEvent.clear(input);
    await userEvent.type(input, "Tar");
    await userEvent.keyboard("{Escape}");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveValue("Destilería Cinti Viejo");
  });

  it("muestra el vacío cuando nada coincide", async () => {
    render(<Combobox aria-label="Bodega" options={wineries} labels={{ empty: "Nada" }} />);
    await userEvent.type(screen.getByRole("combobox"), "zzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByRole("status")).toHaveTextContent("Nada");
  });

  it("selección múltiple: alterna opciones, quita con el botón y con Retroceso", async () => {
    function Multi() {
      const [value, setValue] = useState<string[]>(["cinti"]);
      return (
        <>
          <Combobox
            multiple
            aria-label="Bodegas"
            options={wineries}
            value={value}
            onValueChange={setValue}
          />
          <output>{value.join(",")}</output>
        </>
      );
    }
    render(<Multi />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    await userEvent.click(screen.getByRole("option", { name: /Calamuchita/ }));
    expect(screen.getByText("cinti,calamuchita", { selector: "output" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Calamuchita/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.click(screen.getByRole("button", { name: "Quitar Destilería Cinti Viejo" }));
    expect(screen.getByText("calamuchita", { selector: "output" })).toBeInTheDocument();
    input.focus();
    await userEvent.keyboard("{Backspace}");
    expect(screen.getByText("", { selector: "output" })).toBeInTheDocument();
  });

  it("búsqueda asíncrona con estado de carga y cancelación", async () => {
    const loadOptions = vi.fn(async (query: string) =>
      wineries.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
    );
    const onValueChange = vi.fn();
    render(
      <Combobox
        aria-label="Bodega"
        loadOptions={loadOptions}
        debounceMs={10}
        minQueryLength={2}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    expect(screen.getByRole("status")).toHaveTextContent("Escribe para buscar");
    await userEvent.type(input, "Cinti");
    expect(await screen.findByRole("option", { name: /Cinti Viejo/ })).toBeInTheDocument();
    expect(loadOptions).toHaveBeenLastCalledWith("Cinti", expect.any(AbortSignal));
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(
      "cinti",
      expect.objectContaining({ value: "cinti" }),
    );
  });

  it("informa del error de la búsqueda asíncrona", async () => {
    render(
      <Combobox
        aria-label="Bodega"
        debounceMs={0}
        loadOptions={() => Promise.reject(new Error("500"))}
      />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("No se pudieron cargar las opciones"),
    );
  });

  it("borra la selección con el botón clearable", async () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        aria-label="Bodega"
        options={wineries}
        defaultValue="cinti"
        clearable
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Borrar selección" }));
    expect(onValueChange).toHaveBeenCalledWith(null, null);
    expect(screen.getByRole("combobox")).toHaveValue("");
  });
});
