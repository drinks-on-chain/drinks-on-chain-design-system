import type { Meta, StoryObj } from "@storybook/react-vite";
import { Lock, Plus } from "lucide-react";
import type { ReactNode } from "react";
import {
  Alert,
  AppShell,
  AuthLayout,
  BrandSeal,
  Badge,
  Button,
  Card,
  CardHeader,
  Countdown,
  DataTable,
  Field,
  Input,
  Progress,
  Select,
  StatCard,
  Timeline,
  type DataTableColumn,
  VineyardScene,
} from "../../index";
import { erpNavigation } from "../navigation";

// Maqueta 01-erp.html · reproducida solo con componentes del paquete y maquetación.

const meta = {
  title: "Maquetas/ERP",
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "xl1280", isRotated: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface Task {
  id: string;
  task: string;
  lot: string;
  due: { label: string; tone?: "warning" | "danger" };
  action: { label: string; primary?: boolean };
}

const tasks: Task[] = [
  {
    id: "t1",
    task: "Medir temperatura",
    lot: "Tanque 04 · Moscatel 26",
    due: { label: "Hoy 14:00", tone: "warning" },
    action: { label: "Registrar" },
  },
  {
    id: "t2",
    task: "Aprobar ingreso de uva",
    lot: "Cinti 02 · 6.200 kg",
    due: { label: "Vencida", tone: "danger" },
    action: { label: "Analizar", primary: true },
  },
  {
    id: "t3",
    task: "Decidir destino del lote",
    lot: "Tanque 03 · SGR 26",
    due: { label: "Mañana" },
    action: { label: "Bifurcar" },
  },
];

const taskColumns: DataTableColumn<Task>[] = [
  { id: "task", header: "Tarea", accessor: "task" },
  { id: "lot", header: "Lote", accessor: "lot", hideBelow: "md" },
  {
    id: "due",
    header: "Vence",
    cell: (row) =>
      row.due.tone ? <Badge tone={row.due.tone}>{row.due.label}</Badge> : row.due.label,
  },
  {
    id: "action",
    header: <span className="sr-only">Acción</span>,
    align: "right",
    cell: (row) => (
      <Button size="sm" variant={row.action.primary ? "primary" : "secondary"}>
        {row.action.label}
      </Button>
    ),
  },
];

function ErpShell({ children, path = "/" }: { children: ReactNode; path?: string }) {
  return (
    <AppShell
      navigation={erpNavigation}
      currentPath={path}
      user={{ name: "Lucía Rojas", role: "Enóloga · Cinti Viejo" }}
      breadcrumbs={[{ label: "Cinti Viejo", href: "/" }, { label: "Panel" }]}
      topbarActions={
        <>
          <Badge tone="info" className="max-sm:hidden">
            3 tareas hoy
          </Badge>
          <Button iconStart={<Plus aria-hidden />}>Registrar ingreso</Button>
        </>
      }
    >
      {children}
    </AppShell>
  );
}

/** 02 · AppShell · Dashboard (pantalla principal de la maqueta). */
export const Dashboard: Story = {
  render: () => (
    <ErpShell>
      <h1 className="mt-0 mb-5 font-display text-3xl font-medium">Buenos días, Lucía</h1>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Lotes activos" value="12" delta="+2 esta semana" trend="up" />
        <StatCard label="Kilos procesados hoy" value="18.400" delta="3 ingresos" />
        <StatCard
          label="Tanques en fermentación"
          value="4"
          unit="/ 8"
          delta="1 listo para bifurcar"
        />
        <StatCard label="Alertas" value="2" tone="warning" delta="Temperatura · Tanque 04" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card padding="none">
          <CardHeader
            divided
            title="Tareas pendientes"
            action={
              <Button variant="tertiary" size="sm">
                Ver todas
              </Button>
            }
          />
          <DataTable
            bleed
            stickyHeader={false}
            data={tasks}
            columns={taskColumns}
            getRowId={(row) => row.id}
            caption="Tareas pendientes"
          />
        </Card>
        <Card>
          <CardHeader title="Candados activos" />
          <Timeline
            items={[
              { title: "SGR 2026 · 01 · reposo", time: "Faltan 142 días", status: "current" },
              {
                title: "Tannat Reserva 24 · roble francés",
                time: "Faltan 38 días",
                status: "current",
              },
              {
                title: "Moscatel Blanco 25",
                time: "Liberado · listo para embotellar",
                status: "done",
              },
            ]}
          />
        </Card>
      </div>
    </ErpShell>
  ),
};

/** 05 · Vendimia · pesaje y análisis (pantallas táctiles). */
export const PesajeYAnalisis: Story = {
  render: () => (
    <ErpShell path="/vendimia">
      <h1 className="mt-0 mb-5 font-display text-3xl font-medium">Vendimia y laboratorio</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card variant="sunken" padding="lg" className="grid content-start gap-5">
          <Field label="Terroir de origen">
            <Select
              size="lg"
              defaultValue="cinti-02"
              options={[{ value: "cinti-02", label: "Cinti 02 · Los Parrales · Moscatel" }]}
            />
          </Field>
          <Field
            label="Peso neto recibido"
            help="Fecha y hora se registran automáticamente · 4 mar 2026 · 09:42"
          >
            <Input giant defaultValue="18.400" suffix="kg" />
          </Field>
          <Button size="xl" block>
            Registrar ingreso
          </Button>
        </Card>
        <Card variant="sunken" padding="lg" className="grid content-start gap-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Grados Brix", "23,4", "Objetivo 22–25"],
              ["pH", "3,40", "Objetivo 3,2–3,6"],
              ["Acidez total", "5,9", "g/L · objetivo 5–7"],
            ].map(([label, value, range]) => (
              <Card key={label} className="grid gap-2 text-center">
                <Field label={label} help={range} className="justify-items-center">
                  <Input
                    numeric
                    defaultValue={value}
                    className="min-h-20 text-center text-4xl font-medium"
                  />
                </Field>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="destructive" size="xl">
              Rechazar lote
            </Button>
            <Button variant="success" size="xl">
              Aprobar lote
            </Button>
          </div>
        </Card>
      </div>
      <Card className="mt-4 grid gap-4 lg:max-w-[50%]">
        <Alert tone="warning" icon={<Lock aria-hidden />} title="Lote inmovilizado por normativa">
          Mínimo 6 meses para Singani Gran Reserva. Se libera el 13 de octubre de 2026.
        </Alert>
        <Countdown
          target="2026-10-13T00:00:00-04:00"
          now={new Date("2026-05-24T00:00:00-04:00")}
          format="days"
          tone="warning"
        />
        <Progress value={22} tone="warning" label="Reposo cumplido" />
        <div className="flex justify-between text-xs text-fg-subtle">
          <span>16 abr 2026 · inicio del reposo</span>
          <span>13 oct 2026 · fin</span>
        </div>
        <Button size="lg" block disabled>
          Pasar a embotellado
        </Button>
      </Card>
    </ErpShell>
  ),
};

/** 03 · Login dividido. */
export const Login: Story = {
  render: () => (
    <AuthLayout
      variant="split"
      brand={<BrandSeal tagline="ERP de trazabilidad" />}
      image={<VineyardScene />}
      imageCaption={
        <>
          <p className="m-0 mb-1.5 font-display text-sm tracking-eyebrow text-fg-muted uppercase">
            Valle de Cinti · 2.350 m
          </p>
          <p className="m-0 font-display text-3xl leading-tight font-medium">
            La verdad física del producto, de la tierra a la botella.
          </p>
        </>
      }
      footer="Acceso exclusivo para bodegas asociadas. Si tu bodega no tiene credenciales, contacta con el equipo de Drinks on Chain."
    >
      <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
        <Field label="Correo electrónico">
          <Input size="lg" type="email" placeholder="nombre@bodega.bo" />
        </Field>
        <Field label="Contraseña">
          <Input size="lg" type="password" defaultValue="contraseña" />
        </Field>
        <Button type="submit" size="lg" block>
          Iniciar sesión
        </Button>
        <Button variant="tertiary">¿Olvidaste tu contraseña?</Button>
      </form>
    </AuthLayout>
  ),
};
