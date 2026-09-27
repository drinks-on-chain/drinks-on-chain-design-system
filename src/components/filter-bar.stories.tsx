import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { FilterBar, type ActiveFilter } from "./filter-bar";
import { Input } from "./input";
import { Pill, PillGroup } from "./pill";
import { Select } from "./select";

const statuses = [
  { value: "ACTIVE", label: "Activa" },
  { value: "INVITED", label: "Invitada" },
  { value: "SUSPENDED", label: "Suspendida" },
  { value: "REVOKED", label: "Revocada" },
];

function WineriesFilters() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string | undefined>("ACTIVE");
  const [region, setRegion] = useState<string | undefined>("Tarija");

  const filters: ActiveFilter[] = [
    ...(q ? [{ id: "q", label: "Texto", value: q }] : []),
    ...(status
      ? [{ id: "status", label: "Estado", value: statuses.find((s) => s.value === status)?.label }]
      : []),
    ...(region ? [{ id: "region", label: "Región", value: region }] : []),
  ];

  return (
    <FilterBar
      filters={filters}
      onRemove={(id) => {
        if (id === "q") setQ("");
        if (id === "status") setStatus(undefined);
        if (id === "region") setRegion(undefined);
      }}
      onClearAll={() => {
        setQ("");
        setStatus(undefined);
        setRegion(undefined);
      }}
      resultCount={`${filters.length === 0 ? 48 : 12} bodegas`}
      actions={
        <>
          <Button variant="secondary" size="sm" iconStart={<Download aria-hidden />}>
            Exportar
          </Button>
          <Button size="sm" iconStart={<Plus aria-hidden />}>
            Alta directa
          </Button>
        </>
      }
    >
      <Input
        size="sm"
        className="w-64"
        aria-label="Buscar por nombre o NIT"
        placeholder="Nombre o NIT…"
        prefix={<Search className="size-4" aria-hidden />}
        wrapperClassName="w-auto"
        value={q}
        onChange={(event) => setQ(event.target.value)}
      />
      <Select
        size="sm"
        className="w-40"
        aria-label="Estado"
        placeholder="Estado"
        options={statuses}
        value={status ?? ""}
        onValueChange={setStatus}
      />
      <PillGroup label="Región">
        {["Tarija", "Cinti", "Santa Cruz"].map((name) => (
          <Pill
            key={name}
            size="sm"
            pressed={region === name}
            onPressedChange={(pressed) => setRegion(pressed ? name : undefined)}
          >
            {name}
          </Pill>
        ))}
      </PillGroup>
    </FilterBar>
  );
}

const meta = {
  title: "Componentes/Datos/FilterBar",
  component: FilterBar,
  decorators: [(Story) => <div className="max-w-5xl text-sm">{Story()}</div>],
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Directorio de bodegas: búsqueda, estado, región y chips de filtros activos. */
export const Bodegas: Story = { render: () => <WineriesFilters /> };

export const SoloChips: Story = {
  args: {
    filters: [
      { id: "action", label: "Acción", value: "MEMBER_BLOCKED" },
      { id: "org", label: "Organización", value: "Destilería Cinti Viejo" },
    ],
    onClearAll: () => {},
    onRemove: () => {},
    resultCount: "231 eventos",
  },
};

export const Cava: Story = { render: () => <WineriesFilters />, globals: { theme: "cava" } };
