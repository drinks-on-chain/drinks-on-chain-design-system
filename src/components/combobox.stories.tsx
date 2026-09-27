import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Combobox, type ComboboxOption, type ComboboxSingleProps } from "./combobox";
import { Field } from "./field";

const wineries: ComboboxOption[] = [
  {
    value: "cinti",
    label: "Destilería Cinti Viejo",
    description: "NIT 1029384017 · Cinti",
    group: "Activas",
  },
  {
    value: "calamuchita",
    label: "Bodega Altos de Calamuchita",
    description: "NIT 3847261019 · Tarija",
    group: "Activas",
  },
  {
    value: "guadalquivir",
    label: "Viñedos del Guadalquivir",
    description: "NIT 5520193847 · Tarija",
    group: "Invitadas",
  },
  {
    value: "uriondo",
    label: "Casa Uriondo",
    description: "NIT 7719203846 · Tarija",
    group: "Suspendidas",
    disabled: true,
  },
  {
    value: "samaipata",
    label: "Bodega Samaipata",
    description: "NIT 6613209475 · Santa Cruz",
    group: "Invitadas",
  },
];

const plain = wineries.map(({ group: _group, ...option }) => option);

/** Simula `GET /v1/platform/wineries?q=` con 400 ms de latencia. */
function searchWineries(query: string, signal: AbortSignal): Promise<ComboboxOption[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        resolve(plain.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))),
      400,
    );
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Abortado", "AbortError"));
    });
  });
}

const meta = {
  title: "Componentes/Formularios/Combobox",
  component: Combobox,
  args: { options: plain, placeholder: "Busca una bodega…", "aria-label": "Bodega" },
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
} satisfies Meta<ComboboxSingleProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  render: (args) => (
    <Field label="Bodega" help="Escribe para filtrar; ↑ ↓ para moverte, Enter para elegir.">
      <Combobox {...args} aria-label={undefined} clearable />
    </Field>
  ),
};

export const Agrupada: Story = { args: { options: wineries } };

function MultipleDemo() {
  const [value, setValue] = useState<string[]>(["cinti", "guadalquivir"]);
  return (
    <Field label="Bodegas afectadas" help={`${value.length} elegidas`}>
      <Combobox multiple options={plain} value={value} onValueChange={setValue} clearable />
    </Field>
  );
}

export const Multiple: Story = { render: () => <MultipleDemo /> };

export const Asincrona: Story = {
  render: () => (
    <Field label="Bodega (búsqueda en el servidor)">
      <Combobox loadOptions={searchWineries} minQueryLength={2} placeholder="Mínimo 2 letras…" />
    </Field>
  ),
};

export const Compacta: Story = { args: { size: "sm" } };

export const ConError: Story = {
  render: () => (
    <Field label="Bodega" error="Elige una bodega activa" required>
      <Combobox options={plain} />
    </Field>
  ),
};

export const Cava: Story = { args: { options: wineries }, globals: { theme: "cava" } };
