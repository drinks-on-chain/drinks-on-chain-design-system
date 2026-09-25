import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, MoreHorizontal, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  AdminShell,
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  DataTable,
  Divider,
  Field,
  IconButton,
  Input,
  KeyValueList,
  Menu,
  Modal,
  ModalClose,
  Pagination,
  Pill,
  PillGroup,
  Select,
  SlideOver,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type DataTableColumn,
} from "../../index";
import { adminNavigation } from "../navigation";

// Maqueta 03-backoffice.html · densidad compacta, barra lateral Cava Reserva.

const meta = {
  title: "Maquetas/Backoffice",
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "xxl1440", isRotated: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Admin({ path, children }: { path: string; children: ReactNode }) {
  return (
    <AdminShell
      navigation={adminNavigation}
      currentPath={path}
      user={{ name: "Ana Gutiérrez", role: "Gestora · admin_plataforma" }}
      search={{ onOpen: () => {}, placeholder: "Buscar bodega, lote, usuario, ticket…" }}
      notifications={
        <>
          <IconButton label="Notificaciones">
            <Bell aria-hidden />
          </IconButton>
          <Badge tone="warning">2 alertas</Badge>
        </>
      }
      className="text-sm"
    >
      {children}
    </AdminShell>
  );
}

function RangeFilter() {
  const [range, setRange] = useState("7");
  return (
    <PillGroup label="Periodo">
      {[
        ["7", "7 días"],
        ["30", "30 días"],
        ["365", "Año"],
      ].map(([value, label]) => (
        <Pill
          key={value}
          size="sm"
          pressed={range === value}
          onPressedChange={() => setRange(value!)}
        >
          {label}
        </Pill>
      ))}
    </PillGroup>
  );
}

const alerts = [
  {
    tone: "bg-success",
    text: (
      <>
        Cinti Viejo finalizó embotellado · <strong>2.200 botellas</strong> Singani Gran Reserva 2026
      </>
    ),
    meta: "hace 12 min · lote listo para emitir",
    action: <Button size="sm">Revisar</Button>,
  },
  {
    tone: "bg-warning",
    text: "Altos de Calamuchita · Tanque 04 con temperatura alta 3 días seguidos",
    meta: "hace 2 h · informativo",
    action: (
      <Button size="sm" variant="secondary">
        Ver
      </Button>
    ),
  },
  {
    tone: "bg-info",
    text: "Emisión VPAT24 confirmada en la red",
    meta: "ayer · hash 77be…0d",
    action: (
      <Button size="sm" variant="secondary">
        Explorador ↗
      </Button>
    ),
  },
];

interface Account {
  id: string;
  name: string;
  balance: string;
  status: ReactNode;
}

const accounts: Account[] = [
  {
    id: "a1",
    name: "Relayer (comisiones)",
    balance: "1.240 XLM",
    status: <Badge tone="success">OK</Badge>,
  },
  {
    id: "a2",
    name: "Emisora plataforma",
    balance: "—",
    status: <Badge tone="info">Clawback habilitado</Badge>,
  },
  {
    id: "a3",
    name: "Renta de smart accounts",
    balance: "312 XLM",
    status: <Badge tone="warning">Extender TTL en 9 días</Badge>,
  },
];

/** 02 · AdminShell · Dashboard de operaciones (pantalla principal). */
export const Dashboard: Story = {
  render: () => (
    <Admin path="/">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-3xl font-medium">Operaciones</h1>
        <RangeFilter />
      </div>
      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Nuevos miembros"
          value="318"
          delta="+24 % vs. semana anterior"
          trend="up"
        />
        <StatCard label="Botellas tokenizadas" value="5.320" delta="4 colecciones activas" />
        <StatCard
          label="Retiros confirmados"
          value="541"
          delta="98,7 % sin incidencias"
          trend="up"
        />
        <StatCard
          label="Tickets abiertos"
          value="6"
          tone="warning"
          delta="2 urgentes"
          trend="down"
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Alertas del ERP"
            action={
              <Button variant="tertiary" size="sm">
                Ver pipeline
              </Button>
            }
          />
          <ul className="m-0 list-none p-0">
            {alerts.map((alert, index) => (
              <li
                key={index}
                className="grid grid-cols-[8px_1fr_auto] items-start gap-3 border-b border-border py-2.5 last:border-b-0"
              >
                <span aria-hidden="true" className={`mt-1.5 size-2 rounded-full ${alert.tone}`} />
                <div>
                  {alert.text}
                  <small className="block text-xs text-fg-subtle">{alert.meta}</small>
                </div>
                {alert.action}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader
            title="Cuentas operativas"
            action={<Badge tone="success">Relayer activo</Badge>}
          />
          <DataTable<Account>
            density="compact"
            stickyHeader={false}
            data={accounts}
            getRowId={(row) => row.id}
            caption="Cuentas operativas"
            columns={[
              { id: "name", header: "Cuenta", accessor: "name" },
              { id: "balance", header: "Saldo", accessor: "balance", numeric: true },
              { id: "status", header: "Estado", cell: (row) => row.status },
            ]}
          />
        </Card>
      </div>
    </Admin>
  ),
};

interface Winery {
  id: string;
  name: string;
  region: string;
  lots: number;
  tokenized: number;
  account: string | null;
  status: { label: string; tone: "success" | "info" | "neutral" };
}

const wineries: Winery[] = [
  {
    id: "w1",
    name: "Destilería Cinti Viejo",
    region: "Cinti · Camargo",
    lots: 5,
    tokenized: 3100,
    account: "GDQ4…7KXV",
    status: { label: "Socia", tone: "success" },
  },
  {
    id: "w2",
    name: "Bodega Altos de Calamuchita",
    region: "Tarija · Santa Ana",
    lots: 4,
    tokenized: 2220,
    account: "GBX2…M9QA",
    status: { label: "Socia", tone: "success" },
  },
  {
    id: "w3",
    name: "Viñedos del Guadalquivir",
    region: "Tarija · Concepción",
    lots: 0,
    tokenized: 0,
    account: null,
    status: { label: "En conversación", tone: "info" },
  },
  {
    id: "w4",
    name: "Casa Uriondo",
    region: "Tarija · Uriondo",
    lots: 0,
    tokenized: 0,
    account: null,
    status: { label: "Referencia", tone: "neutral" },
  },
];

const format = new Intl.NumberFormat("es-BO");

const wineryColumns: DataTableColumn<Winery>[] = [
  {
    id: "name",
    header: "Bodega",
    accessor: "name",
    sortable: true,
    cell: (row) => <strong>{row.name}</strong>,
  },
  { id: "region", header: "Región", accessor: "region", sortable: true },
  { id: "lots", header: "Lotes", accessor: "lots", numeric: true, sortable: true },
  {
    id: "tokenized",
    header: "Tokenizadas",
    accessor: "tokenized",
    numeric: true,
    sortable: true,
    cell: (row) => format.format(row.tokenized),
  },
  {
    id: "account",
    header: "Cuenta Stellar",
    cell: (row) =>
      row.account ? (
        <code className="font-mono text-xs text-fg-muted">{row.account}</code>
      ) : (
        <span className="text-fg-subtle">—</span>
      ),
  },
  {
    id: "status",
    header: "Estado",
    cell: (row) => <Badge tone={row.status.tone}>{row.status.label}</Badge>,
  },
];

/** 03 · Socios: directorio compacto de bodegas y perfil en SlideOver. */
export const Socios: Story = {
  render: () => (
    <Admin path="/bodegas">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Input size="sm" placeholder="Filtrar…" aria-label="Filtrar bodegas" className="w-64" />
          <PillGroup label="Estado">
            <Pill size="sm" pressed>
              Todas
            </Pill>
            <Pill size="sm">Socias</Pill>
            <Pill size="sm">En conversación</Pill>
            <Pill size="sm">Tarija</Pill>
            <Pill size="sm">Cinti</Pill>
          </PillGroup>
        </div>
        <Button iconStart={<Plus aria-hidden />}>Crear bodega</Button>
      </div>
      <DataTable
        density="compact"
        data={wineries}
        columns={wineryColumns}
        getRowId={(row) => row.id}
        activeRowId="w1"
        caption="Bodegas"
        rowActions={(row) => (
          <Menu
            trigger={
              <IconButton size="sm" label={`Acciones de ${row.name}`}>
                <MoreHorizontal aria-hidden />
              </IconButton>
            }
            items={[
              { label: "Ver perfil" },
              { label: "Generar credenciales ERP" },
              { type: "separator" },
              { label: "Desactivar", destructive: true },
            ]}
          />
        )}
      />
      <Pagination
        className="mt-3"
        total={4}
        limit={20}
        offset={0}
        onOffsetChange={() => {}}
        labels={{ range: (_f, _t, total) => `${total} bodegas` }}
      />
      <SlideOver
        defaultOpen
        size="md"
        title="Destilería Cinti Viejo"
        headerExtra={
          <Badge tone="success" className="justify-self-start">
            Socia desde marzo 2026
          </Badge>
        }
        footer={
          <>
            <Button variant="secondary">Desactivar</Button>
            <Button>Guardar cambios</Button>
          </>
        }
      >
        <Tabs defaultValue="perfil">
          <TabsList aria-label="Secciones de la bodega">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios ERP</TabsTrigger>
            <TabsTrigger value="puntos">Puntos</TabsTrigger>
            <TabsTrigger value="lotes">Lotes</TabsTrigger>
          </TabsList>
          <TabsContent value="perfil" className="grid gap-4.5">
            <KeyValueList
              items={[
                { term: "Razón social", value: "Destilería Cinti Viejo S.R.L." },
                { term: "Región", value: "Valle de Cinti · Camargo" },
                { term: "Contacto", value: "Lucía Rojas · enóloga" },
                { term: "Descuento pactado", value: "20 %" },
              ]}
            />
            <Card padding="sm" className="grid gap-1.5">
              <span className="text-2xs font-medium tracking-label text-fg-subtle uppercase">
                Cuenta Stellar institucional
              </span>
              <div className="flex items-center justify-between">
                <code className="font-mono text-xs">GDQ4…7KXV</code>
                <Badge tone="success">Activa</Badge>
              </div>
              <p className="m-0 text-xs text-fg-subtle">
                Creada por el backend al dar de alta la bodega. Custodia en KMS.
              </p>
            </Card>
            <Card padding="sm" className="grid gap-2 border-accent">
              <strong className="text-sm">Generar credenciales ERP</strong>
              <p className="m-0 text-xs text-fg-subtle">
                Envía un correo seguro con el primer acceso al ERP al contacto de la bodega.
              </p>
              <div className="flex gap-2">
                <Input
                  size="sm"
                  defaultValue="lucia@cintiviejo.test"
                  aria-label="Correo del contacto"
                />
                <Button size="sm">Enviar</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </SlideOver>
    </Admin>
  ),
};

/** 04 · Tokenización: pipeline (kanban aproximado con tarjetas) y modal de emisión al 80 %. */
export const Tokenizacion: Story = {
  render: () => (
    <Admin path="/tokenizacion">
      <h1 className="mt-0 mb-4 font-display text-3xl font-medium">Tokenización</h1>
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {[
          {
            title: "Listos",
            items: [
              [
                "SGR 2026 · 01",
                "Cinti Viejo · 2.200 bot.",
                <Badge key="b" tone="success">
                  Trazabilidad completa
                </Badge>,
              ],
              ["Moscatel Blanco 25", "Altos de Calamuchita · 1.480 bot.", null],
            ],
          },
          {
            title: "En revisión",
            items: [
              [
                "Syrah 2024",
                "Viñedos del Guadalquivir · 900 bot.",
                <span key="s" className="text-xs text-fg-subtle">
                  Ana G. · falta acuerdo de precio
                </span>,
              ],
            ],
            selected: true,
          },
          {
            title: "Emitiendo",
            items: [
              [
                "Blend de Altura 23",
                "1.200 bot.",
                <TxBadge key="t" tone="info" label="Enviada" hash="c1a0…9e" />,
              ],
            ],
          },
          {
            title: "Publicadas",
            items: [
              [
                "Tannat Reserva 24",
                "Bs 145 · 2.200 bot.",
                <TxBadge key="t" tone="success" label="Confirmada" hash="a91f…c2" />,
              ],
              [
                "VPAT 24",
                "Bs 120 · 900 bot.",
                <TxBadge key="t" tone="success" label="Confirmada" hash="77be…0d" />,
              ],
            ],
          },
          {
            title: "Fallidas",
            items: [
              [
                "Clásico 2025",
                "Cinti Viejo · 3.000 bot.",
                <TxBadge key="t" tone="danger" label="Fallida" hash="tx_underfunded" />,
              ],
            ],
          },
        ].map((column) => (
          <Card
            key={column.title}
            variant="sunken"
            padding="sm"
            className="grid content-start gap-2 border-0"
          >
            <h2 className="m-0 flex justify-between px-2 py-1.5 text-2xs font-medium tracking-label text-fg-subtle uppercase">
              {column.title} <span>{column.items.length}</span>
            </h2>
            {column.items.map(([title, detail, extra], index) => (
              <Card
                key={index}
                padding="sm"
                selected={column.selected}
                className="grid gap-1 text-sm"
              >
                <strong className="font-semibold">{title}</strong>
                <span>{detail}</span>
                {extra}
              </Card>
            ))}
          </Card>
        ))}
      </div>
      <Modal
        defaultOpen
        size="wide"
        title="Configurar colección · Singani Gran Reserva 2026"
        description="Destilería Cinti Viejo · lote lot_2026_sgr_01"
        footer={
          <>
            <span className="mr-auto text-xs text-fg-subtle">
              La emisión la firma el backend con la clave de la bodega y publica la colección en el
              Marketplace.
            </span>
            <ModalClose asChild>
              <Button variant="secondary">Guardar borrador</Button>
            </ModalClose>
            <Button size="lg">Aprobar, emitir y publicar</Button>
          </>
        }
      >
        <div className="grid gap-6 text-sm md:grid-cols-[1fr_auto_1fr]">
          <div>
            <span className="mb-2.5 block text-2xs font-medium tracking-label text-fg-subtle uppercase">
              Datos inmutables del ERP · solo lectura
            </span>
            <KeyValueList
              className="gap-y-2.5"
              items={[
                { term: "Cepa", value: "Moscatel de Alejandría" },
                {
                  term: "Terroir",
                  value: (
                    <>
                      Los Parrales · Cinti · 2.350 m{" "}
                      <Badge tone="accent" dot={false}>
                        D.O.
                      </Badge>
                    </>
                  ),
                },
                { term: "Vendimia", value: "4 mar 2026 · 18.400 kg · Brix 23,4" },
                { term: "Destilación", value: "1.500 L corazón · 60 %" },
                { term: "Reposo", value: "180 días · liberado 13 oct" },
                {
                  term: "Embotellado",
                  value: (
                    <>
                      <strong>2.200 botellas</strong> · 40 % · 20 oct 2026
                    </>
                  ),
                },
                { term: "QR", value: "2.200 códigos sincronizados" },
              ]}
            />
            <Alert tone="success" title="Trazabilidad completa" className="mt-3.5">
              Todos los pasos tienen registro, responsable y fecha.
            </Alert>
          </div>
          <Divider orientation="vertical" className="mx-0 max-md:hidden" />
          <div className="grid content-start gap-3">
            <span className="block text-2xs font-medium tracking-label text-fg-subtle uppercase">
              Configuración comercial
            </span>
            <Field
              label="Precio fijo de lanzamiento"
              help="Precio de bodega con 20 % de descuento de distribuidor pactado."
            >
              <Input numeric defaultValue="190" suffix="Bs" />
            </Field>
            <Field
              label="Código del activo"
              help="Hasta 12 caracteres · emisor: cuenta de la bodega · clawback habilitado"
            >
              <Input defaultValue="SGR26CINTI" />
            </Field>
            <Field label="Puntos de recojo habilitados">
              <Select
                defaultValue="todos"
                options={[
                  { value: "todos", label: "Cinti Viejo, La Cava, Vinoteca Sur, Equipetrol" },
                ]}
              />
            </Field>
            <Field label="Retiro disponible desde">
              <Input type="date" defaultValue="2026-10-21" />
            </Field>
          </div>
        </div>
      </Modal>
    </Admin>
  ),
};

function TxBadge({
  tone,
  label,
  hash,
}: {
  tone: "info" | "success" | "danger";
  label: string;
  hash: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <Badge tone={tone}>{label}</Badge>
      <code className="font-mono text-xs text-fg-muted">{hash}</code>
    </span>
  );
}
