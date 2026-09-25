import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import {
  Alert,
  Badge,
  BottomSheet,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  DataTable,
  Divider,
  EmptyState,
  Field,
  Input,
  KeyValueList,
  Modal,
  ModalClose,
  PageShell,
  Pagination,
  Pill,
  PillGroup,
  Progress,
  RadioGroup,
  Select,
  SkeletonText,
  SlideOver,
  StatCard,
  Stepper,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  Tag,
  TextLink,
  Timeline,
  Toast,
  Wordmark,
} from "../../index";
import { lots, numberFormat, statusBadge } from "../fixtures";

// Maqueta 00-fundamentos.html · tokens y componentes base en los dos temas.

const meta = {
  title: "Maquetas/Fundamentos",
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "xxl1440", isRotated: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const primitives: [string, string, string][] = [
  ["paper-0", "#fdfcf5", "Fondo de página"],
  ["paper-1", "#f9f6ee", "Superficies"],
  ["paper-2", "#f4efe2", "Fondos hundidos"],
  ["paper-3", "#ece5d3", "Barras, cabeceras de tabla"],
  ["ink-0", "#000000", "Texto"],
  ["ink-1", "#464340", "Texto secundario"],
  ["ink-2", "#625e54", "Ayuda"],
  ["ink-3", "#a0a095", "Bordes fuertes"],
  ["gold-300", "#d3a642", "Oro sobre cava"],
  ["gold-500", "#b8891f", "Oro · acento"],
  ["gold-700", "#8a651a", "Oro para texto"],
  ["cava-0", "#15120f", "Fondo oscuro"],
  ["cava-1", "#1c1814", "Superficie oscura"],
  ["cava-2", "#241f1a", "Hundido oscuro"],
  ["cava-3", "#2e2823", "Barras oscuras"],
  ["cream-0", "#f3eee2", "Texto sobre cava"],
  ["cream-1", "#c9c1b3", "Secundario sobre cava"],
  ["cream-2", "#9a9184", "Ayuda sobre cava"],
  ["green-600", "#3f7d4a", "Éxito"],
  ["green-300", "#7fc48b", "Éxito · cava"],
  ["red-600", "#b3402c", "Peligro"],
  ["red-300", "#e0705b", "Peligro · cava"],
  ["amber-600", "#b07a1a", "Aviso, candado"],
  ["amber-300", "#d9a441", "Aviso · cava"],
  ["blue-600", "#3b5f8a", "Información, en curso"],
  ["blue-300", "#8fb0d9", "Información · cava"],
];

const semantics = [
  "bg",
  "bg-raised",
  "bg-sunken",
  "bg-deep",
  "fg",
  "fg-muted",
  "fg-subtle",
  "border",
  "border-strong",
  "accent",
  "accent-text",
  "accent-soft",
  "success",
  "success-soft",
  "danger",
  "danger-soft",
  "warning",
  "warning-soft",
  "info",
  "info-soft",
  "focus",
  "overlay",
];

const typeScale: [string, number, string][] = [
  ["2xs", 11, "Etiquetas de tabla"],
  ["xs", 12, "Ayudas, metadatos"],
  ["sm", 14, "Cuerpo denso (Backoffice)"],
  ["md", 16, "Cuerpo (ERP, Marketplace)"],
  ["lg", 18, "Cuerpo cómodo, tablets"],
  ["xl", 20, "Subtítulos"],
  ["2xl", 24, "Títulos de sección · POS base"],
  ["3xl", 30, "Títulos de página"],
  ["4xl", 36, "Cifras KPI"],
  ["5xl", 48, "Báscula, cuenta regresiva"],
  ["6xl", 64, "POS · cantidad"],
  ["7xl", 96, "POS · PIN, semáforo"],
];

function Section({
  index,
  title,
  lead,
  children,
}: {
  index: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16">
      <h2 className="m-0 mb-2 font-display text-3xl leading-tight font-medium">
        <small className="mb-2.5 block font-ui text-2xs font-medium tracking-caps text-accent-text uppercase">
          {index}
        </small>
        {title}
      </h2>
      {lead ? <p className="m-0 mb-6 max-w-[78ch] text-sm text-fg-muted">{lead}</p> : null}
      {children}
    </section>
  );
}

function Swatch({ name, color, detail }: { name: string; color: string; detail?: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="h-16" style={{ background: color }} />
      <div className="grid gap-0.5 px-2.5 py-2 text-xs">
        <strong className="text-sm font-semibold">{name}</strong>
        <code className="font-mono text-2xs text-fg-subtle">{detail ?? color}</code>
      </div>
    </div>
  );
}

function BaseKit() {
  const [filter, setFilter] = useState("Todas");
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2.5">
        <Button>Registrar ingreso</Button>
        <Button variant="secondary">Cancelar</Button>
        <Button variant="tertiary">Ver historial</Button>
        <Button variant="destructive">Rechazar lote</Button>
        <Button loading>Guardando</Button>
        <Button disabled>Deshabilitado</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Button variant="secondary" size="sm">
          sm
        </Button>
        <Button variant="secondary">md</Button>
        <Button variant="secondary" size="lg">
          lg
        </Button>
        <Button size="xl">xl táctil</Button>
      </div>
      <Divider className="my-0" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Correo electrónico"
          required
          help="Usaremos este correo para las credenciales."
        >
          <Input placeholder="nombre@bodega.bo" />
        </Field>
        <Field label="Cepa">
          <Select
            defaultValue="moscatel"
            options={[
              { value: "moscatel", label: "Moscatel de Alejandría" },
              { value: "tannat", label: "Tannat" },
            ]}
          />
        </Field>
        <Field label="Altitud">
          <Input numeric defaultValue="2350" suffix="m s. n. m." />
        </Field>
        <Field label="Contraseña" error="La contraseña no es correcta.">
          <Input type="password" defaultValue="secreto" />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <Checkbox label="Recordar dispositivo" defaultChecked />
        <RadioGroup
          aria-label="Tipo"
          orientation="horizontal"
          defaultValue="vino"
          options={[
            { value: "vino", label: "Vino" },
            { value: "singani", label: "Singani" },
          ]}
        />
        <Switch label="Notificaciones" defaultChecked />
      </div>
      <Divider className="my-0" />
      <div className="flex flex-wrap gap-2">
        <Badge>Borrador</Badge>
        <Badge tone="info">En fermentación</Badge>
        <Badge tone="warning">Bloqueado</Badge>
        <Badge tone="success">Aprobado</Badge>
        <Badge tone="danger">Rechazado</Badge>
        <Badge tone="accent">Tokenizado</Badge>
        <Badge tone="accent" variant="strong" dot={false}>
          D.O. Singani
        </Badge>
        <Tag>Moscatel</Tag>
      </div>
      <PillGroup label="Filtrar por cepa">
        {["Todas", "Moscatel", "Tannat", "Syrah"].map((option) => (
          <Pill key={option} pressed={filter === option} onPressedChange={() => setFilter(option)}>
            {option}
          </Pill>
        ))}
      </PillGroup>
      <Divider className="my-0" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Lotes activos" value="12" delta="+2 esta semana" trend="up" />
        <StatCard label="Kilos hoy" value="18.400" delta="3 ingresos" />
        <Card>
          <KeyValueList
            items={[
              { term: "Terroir", value: "Cinti 02" },
              { term: "Altitud", value: "2.350 m" },
              { term: "Cepa", value: "Moscatel" },
            ]}
          />
        </Card>
      </div>
      <DataTable
        stickyHeader={false}
        data={lots.slice(0, 3)}
        getRowId={(row) => row.id}
        activeRowId="l2"
        caption="Lotes"
        columns={[
          { id: "lot", header: "Lote", accessor: "lot", cell: (row) => <strong>{row.lot}</strong> },
          { id: "winery", header: "Bodega", accessor: "winery" },
          {
            id: "status",
            header: "Estado",
            cell: (row) => (
              <Badge tone={statusBadge[row.status].tone}>{statusBadge[row.status].label}</Badge>
            ),
          },
          {
            id: "bottles",
            header: "Botellas",
            numeric: true,
            cell: (row) => (row.bottles === null ? "—" : numberFormat.format(row.bottles)),
          },
        ]}
      />
      <Tabs defaultValue="resumen">
        <TabsList aria-label="Secciones">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="bitacora">Bitácora</TabsTrigger>
          <TabsTrigger value="laboratorio">Laboratorio</TabsTrigger>
        </TabsList>
      </Tabs>
      <Breadcrumbs
        items={[
          { label: "Vinificación", href: "#" },
          { label: "Tanques", href: "#" },
          { label: "Tanque 03" },
        ]}
      />
      <Pagination total={48} limit={20} offset={0} onOffsetChange={() => {}} />
      <Stepper
        current={1}
        steps={[{ label: "Cantidad" }, { label: "Pago" }, { label: "Confirmación" }]}
      />
      <Divider className="my-0" />
      <Alert tone="warning" title="Lote inmovilizado por normativa">
        Mínimo 6 meses de reposo. Faltan 142 días.
      </Alert>
      <div>
        <Toast title="Ingreso registrado · Tanque 03" />
      </div>
      <EmptyState
        title="Aún no hay cosechas"
        description="Registra la primera cosecha de este terroir para empezar a trazar sus lotes."
        action={<Button size="sm">Nueva cosecha</Button>}
      />
      <SkeletonText lines={3} />
      <Progress value={62} label="Progreso" />
      <Timeline
        items={[
          { title: "Origen · Cinti 02", time: "12 ene 2026", status: "done" },
          { title: "Vendimia · 18.400 kg", time: "4 mar 2026", status: "done" },
          { title: "Destilación · 1.500 L corazón · 60 %", time: "15 abr 2026", status: "done" },
          { title: "Reposo · candado hasta el 13 oct", time: "en curso", status: "current" },
          { title: "Embotellado" },
        ]}
      />
    </div>
  );
}

/** Tokens, tipografía, forma y componentes base en Oro Líquido y Cava Reserva. */
export const Fundamentos: Story = {
  render: () => (
    <div className="bg-bg font-ui text-fg">
      <header className="sticky top-0 z-sticky flex h-14 items-center gap-4 border-b border-border bg-bg/92 px-6 backdrop-blur-md">
        <Wordmark size="md" />
      </header>
      <main className="mx-auto max-w-[1240px] px-6 pt-10 pb-20">
        <div className="border-b border-border pt-8 pb-10">
          <p className="m-0 font-display text-sm tracking-eyebrow text-fg-muted uppercase">
            Sistema de diseño · v2 · 25-09-2026
          </p>
          <h1 className="m-0 mb-3 font-display text-5xl leading-[1.1] font-medium tracking-[0.02em]">
            Fundamentos
          </h1>
          <p className="m-0 max-w-[72ch] font-text text-lg text-fg-muted">
            Papel, tinta y un solo oro. Dos familias, editorial y operativa, sobre los mismos tokens
            y componentes. Usa el conmutador de tema de la barra de herramientas para alternar toda
            la página.
          </p>
        </div>

        <Section
          index="02"
          title="Color · primitivos"
          lead="Nunca se usan directamente en componentes: solo a través de los semánticos."
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
            {primitives.map(([name, value, use]) => (
              <Swatch key={name} name={name} color={value} detail={`${value} · ${use}`} />
            ))}
          </div>
        </Section>

        <Section
          index="03"
          title="Color · semánticos por tema"
          lead="Oro Líquido a la izquierda, Cava Reserva a la derecha; cada bloque va envuelto en su data-theme."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {(["oro", "cava"] as const).map((theme) => (
              <div
                key={theme}
                data-theme={theme}
                className="rounded-md border border-border bg-bg p-6"
              >
                <span className="mb-4 block text-2xs font-medium tracking-caps text-fg-subtle uppercase">
                  {theme === "oro" ? "Oro Líquido · claro" : "Cava Reserva · oscuro"}
                </span>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {semantics.map((name) => (
                    <Swatch
                      key={name}
                      name={name}
                      color={`var(--doc-${name})`}
                      detail={`--doc-${name}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section index="04" title="Tipografía">
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="flat" padding="lg">
              <span className="mb-4 block text-2xs font-medium tracking-caps text-fg-subtle uppercase">
                Display · Cormorant Garamond
              </span>
              <p className="m-0 mb-2 font-display text-4xl leading-tight font-medium">
                Cada botella, con su lugar
              </p>
              <p className="m-0 font-display text-sm tracking-eyebrow text-fg-muted uppercase">
                Valle de Cinti · 2.350 m
              </p>
            </Card>
            <Card variant="flat" padding="lg">
              <span className="mb-4 block text-2xs font-medium tracking-caps text-fg-subtle uppercase">
                Texto editorial · EB Garamond
              </span>
              <p className="m-0 font-text text-lg leading-editorial">
                El singani reposa en tanques neutros de acero para redondear su perfil sin adquirir
                notas de madera.
              </p>
            </Card>
            <Card variant="flat" padding="lg">
              <span className="mb-4 block text-2xs font-medium tracking-caps text-fg-subtle uppercase">
                Interfaz · Inter
              </span>
              <p className="m-0 mb-1.5 font-semibold">Registrar ingreso</p>
              <p className="m-0 mb-1.5 text-sm">
                Peso neto recibido · <span className="tabular-nums">18.400 kg</span>
              </p>
              <p className="m-0 text-xs text-fg-subtle">Tanque 03 · 22,4 °C · densidad 1,082</p>
            </Card>
          </div>
          <div className="mt-8">
            {typeScale.map(([name, px, use]) => (
              <div
                key={name}
                className="grid grid-cols-[120px_1fr_160px] items-baseline gap-4 border-b border-border py-2.5"
              >
                <code className="justify-self-start rounded-sm bg-bg-sunken px-1.5 py-0.5 font-mono text-xs text-fg-muted">
                  text-{name}
                </code>
                <span
                  className={px >= 30 ? "font-display leading-[1.1] font-medium" : "leading-[1.1]"}
                  style={{
                    fontSize: `var(--doc-text-${name})`,
                    maxHeight: "3.2rem",
                    overflow: "hidden",
                  }}
                >
                  {use}
                </span>
                <span className="text-right text-xs text-fg-subtle">{px} px</span>
              </div>
            ))}
          </div>
        </Section>

        <Section index="05" title="Espacio, forma, elevación, movimiento">
          <div className="grid gap-4 md:grid-cols-2">
            <Card variant="flat" padding="lg">
              <span className="mb-4 block text-2xs font-medium tracking-caps text-fg-subtle uppercase">
                Espaciado · múltiplos de 4
              </span>
              <div className="flex items-end gap-3">
                {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((size) => (
                  <div
                    key={size}
                    className="grid justify-items-center gap-1.5 text-2xs text-fg-subtle"
                  >
                    <span
                      className="block border border-accent bg-accent-soft"
                      style={{ width: size, height: size }}
                    />
                    {size}
                  </div>
                ))}
              </div>
            </Card>
            <Card variant="flat" padding="lg">
              <span className="mb-4 block text-2xs font-medium tracking-caps text-fg-subtle uppercase">
                Radio
              </span>
              <div className="flex gap-3">
                {["rounded-none", "rounded-sm", "rounded-md", "rounded-lg", "rounded-full"].map(
                  (radius) => (
                    <div key={radius} className={`size-16 border border-border-strong ${radius}`} />
                  ),
                )}
              </div>
              <p className="m-0 mt-3 text-xs text-fg-muted">
                none (editorial) · sm 2 · md 4 · lg 8 · full
              </p>
            </Card>
            <Card variant="flat" padding="lg">
              <span className="mb-4 block text-2xs font-medium tracking-caps text-fg-subtle uppercase">
                Elevación · una sola sombra, solo en overlays
              </span>
              <div className="flex flex-wrap gap-3">
                <Card className="w-40 text-sm">Superficie: sin sombra, hairline</Card>
                <Card className="w-40 text-sm shadow-overlay">Overlay: shadow-overlay</Card>
              </div>
            </Card>
            <Card variant="flat" padding="lg">
              <span className="mb-4 block text-2xs font-medium tracking-caps text-fg-subtle uppercase">
                Overlays
              </span>
              <div className="flex flex-wrap gap-2">
                <Modal
                  title="Destino técnico del lote"
                  trigger={<Button variant="secondary">Modal</Button>}
                  footer={
                    <>
                      <ModalClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                      </ModalClose>
                      <Button>Confirmar</Button>
                    </>
                  }
                >
                  <p className="m-0 text-sm">
                    Al elegir una opción, la ruta contraria queda bloqueada.
                  </p>
                </Modal>
                <SlideOver
                  title="Nueva cosecha"
                  trigger={<Button variant="secondary">SlideOver</Button>}
                  footer={<Button block>Guardar temporada</Button>}
                >
                  <Field label="Rendimiento proyectado">
                    <Input numeric defaultValue="18000" suffix="kg" />
                  </Field>
                </SlideOver>
                <BottomSheet
                  title="Adquirir · 2 botellas"
                  trigger={<Button variant="secondary">BottomSheet</Button>}
                  footer={
                    <Button block size="lg">
                      Pagar Bs 380
                    </Button>
                  }
                >
                  <p className="m-0 text-sm">Singani Gran Reserva 2026 · Bs 190 c/u</p>
                </BottomSheet>
              </div>
            </Card>
          </div>
        </Section>

        <Section
          index="06"
          title="Componentes base en ambos temas"
          lead="Los mismos componentes y tokens semánticos; solo cambia el tema del contenedor."
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <div data-theme="oro" className="rounded-md border border-border bg-bg p-6">
              <BaseKit />
            </div>
            <div data-theme="cava" className="rounded-md border border-border bg-bg p-6">
              <BaseKit />
            </div>
          </div>
        </Section>

        <Section
          index="08"
          title="Componentes editoriales"
          lead="Heredados de las landings: PageShell y TextLink."
        >
          <div className="overflow-hidden rounded-md border border-border">
            <PageShell eyebrow="Valle de Cinti" title="Singani Gran Reserva" className="min-h-0">
              <p>
                Moscatel de Alejandría cultivado a 2.350 metros. Destilado en alambique de cobre,
                mil quinientos litros de corazón al sesenta por ciento, seis meses de reposo en
                acero.
              </p>
              <p>
                <TextLink href="#" current>
                  Ver la trazabilidad completa
                </TextLink>
              </p>
            </PageShell>
          </div>
        </Section>
      </main>
    </div>
  ),
};
