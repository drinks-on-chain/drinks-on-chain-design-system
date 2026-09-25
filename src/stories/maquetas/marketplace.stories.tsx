import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import {
  Alert,
  Badge,
  BottomSheet,
  Button,
  Card,
  QRCode,
  RadioGroup,
  Stepper,
  StoreShell,
  TextLink,
} from "../../index";
import { BottleArt } from "../fixtures";
import { storeDesktopNavigation, storeTabs } from "../navigation";

// Maqueta 02-marketplace.html · escaparate, ficha, checkout, cava y pase de retiro.

const meta = {
  title: "Maquetas/Marketplace",
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "sm375", isRotated: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const bottles = [
  {
    kind: "Singani",
    name: "Gran Reserva 2026",
    winery: "Cinti Viejo · Camargo",
    price: "Bs 190",
    note: "preventa",
    variant: "singani" as const,
  },
  {
    kind: "Vino",
    name: "Tannat Reserva 2024",
    winery: "Altos de Calamuchita",
    price: "Bs 145",
    note: "listo",
    variant: "vino" as const,
  },
  {
    kind: "Singani",
    name: "Clásico 2025",
    winery: "Cinti Viejo",
    price: "Bs 95",
    variant: "singani" as const,
  },
  {
    kind: "Vino",
    name: "Moscatel Blanco 2025",
    winery: "Altos de Calamuchita",
    price: "Bs 110",
    variant: "vino" as const,
  },
];

function Price({ value, note, large }: { value: string; note?: string; large?: boolean }) {
  return (
    <span
      className={
        large
          ? "font-display text-2xl text-accent-text"
          : "font-display text-lg leading-none text-accent-text"
      }
    >
      {value}
      {note ? <small className="ml-1 font-ui text-xs text-fg-subtle">· {note}</small> : null}
    </span>
  );
}

function Store({
  path = "/",
  children,
  hideTabs,
}: {
  path?: string;
  children: ReactNode;
  hideTabs?: boolean;
}) {
  return (
    <StoreShell
      navigation={storeTabs}
      desktopNavigation={storeDesktopNavigation}
      currentPath={path}
      hideTabs={hideTabs}
      headerActions={
        <Button variant="secondary" size="sm">
          Entrar
        </Button>
      }
    >
      {children}
    </StoreShell>
  );
}

/** 2.1 Escaparate: hero del último lanzamiento y grid de botellas (pantalla principal). */
export const Escaparate: Story = {
  render: () => (
    <Store>
      <div className="px-5 pt-2 pb-6 md:px-8">
        <Card
          radius="lg"
          padding="none"
          className="relative grid min-h-52 content-end gap-1.5 overflow-hidden border-0 bg-[repeating-linear-gradient(120deg,rgba(0,0,0,.05)_0_1px,transparent_1px_7px),linear-gradient(160deg,var(--doc-paper-2),var(--doc-paper-3))] px-4.5 py-5.5 text-ink-0"
        >
          <Badge tone="accent" className="justify-self-start">
            Nuevo lanzamiento
          </Badge>
          <h2 className="m-0 font-display text-2xl leading-tight font-medium">
            Singani Gran Reserva 2026
          </h2>
          <span className="text-sm text-ink-1">Cinti Viejo · Valle de Cinti · 2.350 m</span>
        </Card>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {bottles.map((bottle) => (
            <a key={bottle.name} href="#ficha" className="grid gap-2 text-inherit no-underline">
              <Card
                radius="lg"
                variant="sunken"
                className="grid aspect-[3/4] place-items-center p-4.5"
              >
                <BottleArt variant={bottle.variant} className="w-10" />
              </Card>
              <span className="font-ui text-2xs font-medium tracking-caps text-fg-subtle uppercase">
                {bottle.kind}
              </span>
              <span className="font-display text-lg leading-tight font-medium">{bottle.name}</span>
              <span className="text-xs text-fg-muted">{bottle.winery}</span>
              <Price value={bottle.price} note={bottle.note} />
            </a>
          ))}
        </div>
      </div>
    </Store>
  ),
};

/** 2.2–2.3 Ficha con barra de compra y checkout en bottom sheet. */
export const FichaYCheckout: Story = {
  render: () => (
    <Store hideTabs>
      <div className="grid h-72 place-items-center border-b border-border bg-[linear-gradient(180deg,var(--doc-paper-1),var(--doc-paper-3))]">
        <BottleArt className="w-16" />
      </div>
      <div className="grid gap-3 px-5 pt-4.5 pb-28">
        <span className="font-display text-xs tracking-eyebrow text-fg-muted uppercase">
          Singani · D.O. · Valle de Cinti
        </span>
        <h1 className="m-0 font-display text-3xl leading-tight font-medium">Gran Reserva 2026</h1>
        <span className="text-sm text-fg-muted">Destilería Cinti Viejo · Camargo · 2.350 m</span>
        <div className="grid grid-cols-3 gap-2 font-ui">
          {[
            ["2.200", "botellas"],
            ["6 meses", "reposo"],
            ["40 % vol", "ajustado"],
          ].map(([value, label]) => (
            <div key={label} className="border-t border-border pt-2 text-xs text-fg-subtle">
              <strong className="block text-sm font-medium text-fg">{value}</strong>
              {label}
            </div>
          ))}
        </div>
        <p className="m-0 text-md leading-normal">
          Moscatel de Alejandría destilado en alambique de cobre. Mil quinientos litros de corazón
          al sesenta por ciento, seis meses de reposo en acero.
        </p>
        <TextLink href="#trazabilidad">Ver la trazabilidad del lote</TextLink>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-sticky flex items-center justify-between gap-3 border-t border-border bg-bg/92 px-5 py-3 backdrop-blur-md">
        <div>
          <Price value="Bs 190" large />
          <div className="font-ui text-xs text-fg-subtle">
            precio de bodega · retiro desde octubre
          </div>
        </div>
        <BottomSheet
          defaultOpen
          title="Adquirir"
          trigger={<Button size="lg">Adquirir</Button>}
          footer={
            <Button size="lg" block>
              Pagar Bs 380
            </Button>
          }
        >
          <div className="grid gap-4.5">
            <Stepper
              current={1}
              steps={[{ label: "Cantidad" }, { label: "Pago" }, { label: "Listo" }]}
            />
            <Card className="flex items-center justify-between px-3.5 py-3">
              <div>
                <strong className="text-sm">Gran Reserva 2026</strong>
                <div className="text-xs text-fg-subtle">
                  2 botellas · retiro en Licorería La Cava
                </div>
              </div>
              <Price value="Bs 380" />
            </Card>
            <RadioGroup
              variant="card"
              aria-label="Método de pago"
              defaultValue="tarjeta"
              options={[
                {
                  value: "tarjeta",
                  label: "Tarjeta de débito o crédito",
                  description: "Pasarela del banco · formulario seguro",
                },
                {
                  value: "qr",
                  label: "QR bancario",
                  description: "Escanea con la app de tu banco",
                },
              ]}
            />
            <p className="m-0 text-xs text-fg-subtle">
              Nunca vemos los datos de tu tarjeta. El pago se procesa en la pasarela del banco.
            </p>
          </div>
        </BottomSheet>
      </div>
    </Store>
  ),
};

/** 3.1 Mi cava: botellas en custodia, pase activo y aviso de recuperación. */
export const MiCava: Story = {
  render: () => (
    <Store path="/cava">
      <div className="px-5 pt-4 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-display text-xs tracking-eyebrow text-fg-muted uppercase">
            Mi cava
          </span>
          <Badge tone="success">Verificado en la red</Badge>
        </div>
        <h1 className="m-0 mb-1 font-display text-3xl font-medium">Hola, María</h1>
        <p className="m-0 mb-4.5 text-sm text-fg-muted">3 botellas en custodia · 1 pase activo</p>
        <div className="grid grid-cols-2 gap-3.5">
          {[
            {
              name: "Gran Reserva 2026",
              qty: "×2",
              meta: (
                <>
                  Cinti Viejo · <span className="text-accent-text">listo para retirar</span>
                </>
              ),
            },
            {
              name: "Tannat Reserva 2024",
              qty: "×1",
              meta: "Altos de Calamuchita · en crianza · 38 días",
            },
          ].map((holding) => (
            <a key={holding.name} href="#activo" className="grid gap-1.5 text-inherit no-underline">
              <Card
                radius="lg"
                variant="sunken"
                className="relative grid aspect-square place-items-center"
              >
                <Badge
                  tone="accent"
                  variant="strong"
                  dot={false}
                  className="absolute top-2 right-2"
                >
                  {holding.qty}
                </Badge>
                <BottleArt className="w-9" />
              </Card>
              <span className="font-display text-md leading-tight font-medium">{holding.name}</span>
              <span className="font-ui text-xs text-fg-subtle">{holding.meta}</span>
            </a>
          ))}
        </div>
        <Card radius="lg" className="mt-4.5 flex items-center justify-between gap-3 font-ui">
          <div>
            <strong className="text-sm">Pase activo · Licorería La Cava</strong>
            <div className="text-xs text-fg-subtle">2 × Gran Reserva 2026 · caduca en 6 días</div>
          </div>
          <Button variant="secondary" size="sm">
            Mostrar
          </Button>
        </Card>
        <Alert tone="info" title="Protege tu cava" className="mt-3.5">
          Añade un correo de recuperación o un segundo dispositivo.
        </Alert>
      </div>
    </Store>
  ),
};

/** 3.2 Pase de retiro con QR grande sobre fondo claro. */
export const PaseDeRetiro: Story = {
  render: () => (
    <div className="min-h-dvh bg-bg-sunken px-5 py-3.5 font-ui">
      <div className="mb-3 flex items-center justify-between">
        <Button variant="tertiary" size="sm" iconStart={<ChevronLeft aria-hidden />}>
          Cava
        </Button>
        <Badge tone="success">Pase activo</Badge>
      </div>
      <Card radius="lg" padding="none" className="overflow-hidden">
        <div className="grid gap-1 px-5 py-4">
          <span className="font-display text-xs tracking-eyebrow text-fg-muted uppercase">
            Pase de retiro
          </span>
          <strong className="font-display text-2xl font-medium">
            2 × Singani Gran Reserva 2026
          </strong>
          <span className="text-sm text-fg-subtle">Cinti Viejo · Titular: María Fernández</span>
        </div>
        <div className="grid place-items-center gap-2.5 border-y border-dashed border-border-strong bg-bg p-5">
          <QRCode value="CLM-0005" label="Código del pase CLM-0005" />
          <span className="text-xs text-fg-subtle">CLM-0005 · muéstralo en el mostrador</span>
        </div>
        <div className="flex justify-between px-5 py-3.5 text-xs text-fg-muted">
          <div>
            <strong className="text-fg">Licorería La Cava</strong>
            <br />
            Av. Domingo Paz 123, Tarija
            <br />
            Lun–Sáb 10:00–20:00
          </div>
          <div className="text-right">
            <strong className="text-fg">Caduca</strong>
            <br />2 oct 2026
            <br />
            en 6 días
          </div>
        </div>
      </Card>
      <div className="mt-2.5 flex justify-center gap-2">
        <Button variant="secondary" size="sm">
          Cambiar punto
        </Button>
        <Button variant="tertiary" size="sm" className="text-danger">
          Anular pase
        </Button>
      </div>
    </div>
  ),
};
