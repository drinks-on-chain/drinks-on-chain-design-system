import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { lots, numberFormat, statusBadge, type LotRow } from "../stories/fixtures";
import { Badge } from "./badge";
import { Button } from "./button";
import { DataTable, type DataTableColumn, type SortState } from "./data-table";
import { EmptyState } from "./empty-state";
import { IconButton } from "./icon-button";
import { Menu } from "./menu";
import { Pagination } from "./pagination";
import { Select } from "./select";

const columns: DataTableColumn<LotRow>[] = [
  {
    id: "lot",
    header: "Lote",
    accessor: "lot",
    sortable: true,
    cell: (row) => <strong className="font-semibold">{row.lot}</strong>,
  },
  { id: "winery", header: "Bodega", accessor: "winery", sortable: true, hideBelow: "md" },
  {
    id: "status",
    header: "Estado",
    accessor: "status",
    cell: (row) => (
      <Badge tone={statusBadge[row.status].tone}>{statusBadge[row.status].label}</Badge>
    ),
  },
  {
    id: "bottles",
    header: "Botellas",
    accessor: "bottles",
    numeric: true,
    sortable: true,
    cell: (row) => (row.bottles === null ? "—" : numberFormat.format(row.bottles)),
  },
];

const meta = {
  title: "Componentes/Datos/DataTable",
  component: DataTable<LotRow>,
  args: { data: lots, columns, getRowId: (row: LotRow) => row.id, caption: "Lotes" },
} satisfies Meta<typeof DataTable<LotRow>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Comoda: Story = {};

export const Compacta: Story = { args: { density: "compact" } };

function SelectionAndActions() {
  const [selected, setSelected] = useState<string[]>(["l2"]);
  const [sort, setSort] = useState<SortState | null>({ columnId: "bottles", direction: "desc" });
  return (
    <div className="grid gap-3">
      <p className="m-0 text-sm text-fg-muted">{selected.length} seleccionadas</p>
      <DataTable
        data={lots}
        columns={columns}
        getRowId={(row) => row.id}
        density="compact"
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        sort={sort}
        onSortChange={setSort}
        activeRowId="l3"
        rowActions={(row) => (
          <Menu
            trigger={
              <IconButton label={`Acciones de ${row.lot}`} size="sm">
                <MoreHorizontal aria-hidden />
              </IconButton>
            }
            items={[
              { label: "Ver detalle", onSelect: () => {} },
              { label: "Exportar QR", onSelect: () => {} },
              { type: "separator" },
              { label: "Archivar", destructive: true, onSelect: () => {} },
            ]}
          />
        )}
      />
      <Pagination total={48} limit={20} offset={0} onOffsetChange={() => {}} />
    </div>
  );
}

export const SeleccionYAcciones: Story = { render: () => <SelectionAndActions /> };

export const CabeceraPegajosa: Story = {
  args: {
    maxHeight: "240px",
    data: [...lots, ...lots.map((row) => ({ ...row, id: row.id + "b" }))],
  },
};

export const Cargando: Story = { args: { loading: true } };

export const Vacia: Story = {
  args: {
    data: [],
    empty: (
      <EmptyState
        bare
        title="Aún no hay lotes"
        description="Los lotes aparecen al aprobar el primer ingreso de uva."
        action={<Button size="sm">Registrar ingreso</Button>}
      />
    ),
  },
};

function BackofficeTable() {
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<SortState | null>({ columnId: "lot", direction: "asc" });
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const filtered: DataTableColumn<LotRow>[] = columns.map((column) =>
    column.id === "status"
      ? {
          ...column,
          filterActive: Boolean(status),
          filter: (
            <Select
              size="sm"
              aria-label="Estado"
              placeholder="Todos los estados"
              value={status ?? ""}
              onValueChange={setStatus}
              options={Object.entries(statusBadge).map(([value, { label }]) => ({ value, label }))}
            />
          ),
        }
      : column,
  );
  return (
    <DataTable
      data={status ? lots.filter((row) => row.status === status) : lots}
      columns={filtered}
      getRowId={(row) => row.id}
      caption="Lotes"
      density="compact"
      maxHeight="360px"
      selectable
      selectedIds={selected}
      onSelectionChange={setSelected}
      sort={sort}
      onSortChange={setSort}
      bulkActions={(ids, clear) => (
        <>
          <Button size="sm" variant="secondary" onClick={clear}>
            Exportar {ids.length}
          </Button>
          <Button size="sm" variant="destructive" onClick={clear}>
            Archivar
          </Button>
        </>
      )}
      pagination={{
        total: 48,
        limit,
        offset,
        onOffsetChange: setOffset,
        pageSizeOptions: [20, 50, 100],
        onLimitChange: (next) => {
          setLimit(next);
          setOffset(0);
        },
      }}
    />
  );
}

/** Backoffice: compacta, orden controlado, filtro por columna, acciones masivas y paginación. */
export const Backoffice: Story = { render: () => <BackofficeTable /> };

export const BackofficeCava: Story = {
  render: () => <BackofficeTable />,
  globals: { theme: "cava" },
};

export const ConError: Story = {
  args: {
    error: { detail: "HTTP 503 · PLATFORM_UNAVAILABLE", onRetry: () => {} },
    density: "compact",
  },
};
