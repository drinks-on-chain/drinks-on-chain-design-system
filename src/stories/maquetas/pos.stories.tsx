import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, ChevronRight, Delete, Flashlight, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Alert, Badge, Button, IconButton, KioskShell, Wordmark } from "../../index";
import { BottleArt } from "../fixtures";

// Maqueta 04-pos.html · tema Cava Reserva completo, densidad gigante.
// PinPad, ScannerViewport, TrafficLightOverlay y SwipeToConfirm son del POS (Etapa 3);
// aquí se aproximan con Button, IconButton y maquetación.

const meta = {
  title: "Maquetas/POS",
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "lg1024", isRotated: false }, theme: "cava" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const branch = "Licorería La Cava · Tarija";

function PinScreen() {
  const [pin, setPin] = useState("12");
  const press = (key: string) => setPin((value) => (value.length < 4 ? value + key : value));
  return (
    <KioskShell branch={branch} clock="10:02">
      <div className="grid place-items-center content-center gap-7 p-6 text-center">
        <Wordmark size="2xl" />
        <p className="-mt-4 mb-0 text-xl text-fg-muted">Licorería La Cava · mostrador 1</p>
        <div
          className="flex justify-center gap-4.5"
          aria-label={`${pin.length} de 4 dígitos`}
          role="img"
        >
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              className={
                index < pin.length
                  ? "size-4.5 rounded-full border-2 border-accent bg-accent"
                  : "size-4.5 rounded-full border-2 border-border-strong"
              }
            />
          ))}
        </div>
        <div className="grid grid-cols-[repeat(3,96px)] gap-3.5">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((key) => (
            <Button
              key={key}
              variant="secondary"
              className="h-24 rounded-lg bg-bg-raised text-4xl active:bg-accent-soft"
              onClick={() => press(key)}
            >
              {key}
            </Button>
          ))}
          <Button variant="tertiary" className="h-24 text-xl text-fg-subtle">
            Ayuda
          </Button>
          <Button
            variant="secondary"
            className="h-24 rounded-lg bg-bg-raised text-4xl"
            onClick={() => press("0")}
          >
            0
          </Button>
          <IconButton
            label="Borrar"
            variant="outline"
            className="h-24 w-full rounded-lg bg-bg-raised [&_svg]:size-7"
            onClick={() => setPin((value) => value.slice(0, -1))}
          >
            <Delete aria-hidden />
          </IconButton>
        </div>
        <p className="m-0 text-lg text-fg-subtle">Introduce tu PIN para abrir el turno</p>
      </div>
    </KioskShell>
  );
}

/** 1.1 Login de sucursal · PinPad (pantalla principal). */
export const PinDeSucursal: Story = { render: () => <PinScreen /> };

/** 2.1 Escáner activo: cámara, retícula en oro, linterna y un botón secundario. */
export const Escaner: Story = {
  render: () => (
    <KioskShell branch={branch} context="Juan P. · turno abierto" clock="10:14">
      <div className="relative grid place-items-center bg-[radial-gradient(ellipse_at_center,#3a3128_0%,#14110e_70%)]">
        <p className="absolute inset-x-0 top-6 m-0 text-center text-xl text-cream-1">
          Apunta al código del pase de retiro del cliente
        </p>
        <IconButton
          label="Linterna"
          variant="outline"
          round
          className="absolute top-5 right-6 size-18 border-2 border-cream-1 text-cream-0 [&_svg]:size-7"
        >
          <Flashlight aria-hidden />
        </IconButton>
        <div aria-hidden="true" className="relative aspect-square w-[46%] max-w-[46vh]">
          <span className="absolute top-0 left-0 size-14 border-t-4 border-l-4 border-gold-300" />
          <span className="absolute top-0 right-0 size-14 border-t-4 border-r-4 border-gold-300" />
          <span className="absolute bottom-0 left-0 size-14 border-b-4 border-l-4 border-gold-300" />
          <span className="absolute right-0 bottom-0 size-14 border-r-4 border-b-4 border-gold-300" />
        </div>
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <Button variant="secondary" size="kiosk" className="border-cream-2 text-cream-0">
            Ver historial de hoy · 7 entregas
          </Button>
        </div>
      </div>
    </KioskShell>
  ),
};

/** 2.2 Semáforo verde: pase válido, cantidad grande y confirmación por deslizador. */
export const SemaforoVerde: Story = {
  render: () => (
    <KioskShell branch={branch} context="Juan P." clock="10:15">
      <div
        role="alert"
        className="grid grid-rows-[1fr_auto] gap-6 border-16 border-green-300 bg-[#1f4a2a] px-12 py-8 text-cream-0"
      >
        <div className="grid items-center gap-10 md:grid-cols-[260px_1fr]">
          <div className="grid aspect-[3/4] place-items-center rounded-lg border-2 border-white/25 bg-[linear-gradient(180deg,#2a5a36,#173a21)]">
            <BottleArt className="w-22 [&_path]:stroke-[#d6e9d9]" />
          </div>
          <div>
            <p className="m-0 mb-2 text-2xl font-semibold tracking-[0.06em] text-green-300">
              ✓ PASE VÁLIDO · CLM-0007
            </p>
            <p className="m-0 text-6xl leading-none font-bold uppercase">
              Entregar <span className="text-7xl">4</span> botellas
            </p>
            <p className="mt-3 mb-0 text-2xl text-cream-1">
              Singani Gran Reserva 2026 · Destilería Cinti Viejo
            </p>
            <p className="mt-3 mb-0 text-2xl">
              Cliente: <strong>Carlos Mamani</strong>
            </p>
          </div>
        </div>
        <Button
          size="kiosk"
          block
          className="justify-start rounded-full border-2 border-green-300 bg-black/35 pl-1 text-xl text-cream-0 hover:bg-black/45"
          iconStart={
            <span className="grid size-15 place-items-center rounded-full bg-green-300 text-[#0e2a16]">
              <ChevronRight aria-hidden />
            </span>
          }
        >
          <span className="flex-1 text-center">Deslizar para confirmar entrega</span>
        </Button>
      </div>
    </KioskShell>
  ),
};

/** 2.3 Semáforo rojo: motivo en texto grande y un solo botón. */
export const SemaforoRojo: Story = {
  render: () => (
    <KioskShell branch={branch} context="Juan P." clock="10:21">
      <div
        role="alert"
        className="grid grid-rows-[1fr_auto] justify-items-center gap-6 border-16 border-red-300 bg-[#5a1f17] px-12 py-8 text-center text-cream-0"
      >
        <div className="grid place-items-center content-center gap-4">
          <TriangleAlert aria-hidden className="size-24 stroke-[1.5]" />
          <p className="m-0 text-5xl leading-none font-bold uppercase">Código ya canjeado</p>
          <p className="m-0 max-w-[40ch] text-2xl text-cream-1">
            Este pase se usó el 24 de septiembre a las 17:40 en Vinoteca Sur. Si el cliente reclama,
            indícale que contacte con soporte desde su app.
          </p>
        </div>
        <Button
          size="kiosk"
          className="min-w-[420px] border-cream-0 bg-cream-0 text-[#5a1f17] hover:bg-cream-1"
        >
          Volver a escanear
        </Button>
      </div>
    </KioskShell>
  ),
};

/** 3.1 Entregado: sello y vuelta automática al escáner. */
export const Entregado: Story = {
  render: () => (
    <KioskShell branch={branch} context="Juan P." clock="10:15">
      <div className="grid place-items-center content-center gap-5 bg-[#173a21] text-center text-cream-0">
        <div className="grid size-50 -rotate-8 place-items-center rounded-full border-6 border-green-300 text-green-300">
          <Check aria-hidden className="size-28" strokeWidth={2} />
        </div>
        <p
          role="status"
          className="m-0 text-5xl leading-none font-bold tracking-[0.04em] uppercase"
        >
          Entregado
        </p>
        <p className="m-0 text-2xl text-cream-1">4 × Singani Gran Reserva 2026 · Carlos Mamani</p>
        <p className="m-0 text-lg text-cream-2">
          Registrado. Confirmación en la red en unos segundos · volviendo al escáner…
        </p>
      </div>
    </KioskShell>
  ),
};

const deliveries = [
  [
    "10:15",
    "Singani Gran Reserva 2026",
    "4",
    <Badge key="b" size="lg" tone="success">
      En cadena
    </Badge>,
  ],
  [
    "11:40",
    "Tannat Reserva 2024",
    "2",
    <Badge key="b" size="lg" tone="success">
      En cadena
    </Badge>,
  ],
  [
    "13:05",
    "Singani Clásico 2025",
    "1",
    <Badge key="b" size="lg" tone="success">
      En cadena
    </Badge>,
  ],
  [
    "17:22",
    "Singani Gran Reserva 2026",
    "2",
    <Badge key="b" size="lg" tone="info">
      Sincronizando
    </Badge>,
  ],
  [
    "18:50",
    "Moscatel Blanco 2025",
    "3",
    <Badge key="b" size="lg" tone="warning">
      Autorizada por soporte
    </Badge>,
  ],
] as const;

/** 3.2 Historial y cierre de turno (recibo monoespaciado). */
export const CierreDeTurno: Story = {
  render: () => (
    <KioskShell branch={branch} context="Juan P." clock="20:02">
      <div className="grid md:grid-cols-[1fr_340px]">
        <div className="px-9 py-7">
          <h1 className="m-0 mb-1 font-display text-3xl font-medium">Entregas de hoy</h1>
          <p className="m-0 mb-5 text-lg text-fg-subtle">
            Jueves 25 de septiembre de 2026 · Juan Pérez · mostrador 1
          </p>
          <table className="w-full border-collapse font-mono text-xl">
            <caption className="sr-only">Entregas del turno</caption>
            <tbody>
              {deliveries.map(([time, product, qty, status]) => (
                <tr key={time} className="border-b border-dashed border-border-strong">
                  <td className="px-2 py-3.5">{time}</td>
                  <td className="px-2 py-3.5">{product}</td>
                  <td className="px-2 py-3.5 text-right tabular-nums">{qty}</td>
                  <td className="px-2 py-3.5 font-ui">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid content-between gap-5 border-l border-border bg-bg-raised px-9 py-7">
          <div>
            <span className="text-sm font-medium tracking-label text-fg-subtle uppercase">
              Botellas entregadas
            </span>
            <div className="font-display text-6xl leading-none font-medium">12</div>
            <p className="mt-2 mb-0 text-lg text-fg-muted">7 entregas · 5 clientes · 0 rechazos</p>
          </div>
          <Alert tone="warning" title="1 entrega pendiente de sincronizar" className="text-md">
            Se confirmará al recuperar la conexión.
          </Alert>
          <div className="grid gap-3">
            <Button variant="secondary" size="kiosk" block className="text-xl">
              Volver al escáner
            </Button>
            <Button size="kiosk" block className="text-xl">
              Cerrar turno y bloquear
            </Button>
          </div>
        </div>
      </div>
    </KioskShell>
  ),
};
