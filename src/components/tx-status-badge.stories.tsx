import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { TxStatusBadge, type TxStatus } from "./tx-status-badge";

// Host de ejemplo (dominio reservado): en las apps la URL completa la devuelve el backend.
const explorerUrl =
  "https://explorer.example/tx/7506466e271ffe2576fe577888eba846e8db514716d682e5726d81c3e274bedf";

const meta = {
  title: "Componentes/Estado/TxStatusBadge",
  component: TxStatusBadge,
  args: { status: "SUBMITTED" },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["PENDING", "BUILDING", "SUBMITTED", "CONFIRMED", "RETRYING", "FAILED"],
    },
  },
} satisfies Meta<typeof TxStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const statuses: TxStatus[] = [
  "PENDING",
  "BUILDING",
  "SUBMITTED",
  "CONFIRMED",
  "RETRYING",
  "FAILED",
];

function AllStates() {
  return (
    <div className="grid gap-3">
      {statuses.map((status) => (
        <div key={status} className="flex items-center gap-4">
          <code className="w-28 font-mono text-xs text-fg-subtle">{status}</code>
          <TxStatusBadge status={status} />
        </div>
      ))}
    </div>
  );
}

/** Los seis estados de `ChainTxStatus`: icono, texto y tono; nunca solo el color. */
export const Estados: Story = { render: () => <AllStates /> };

export const EstadosCava: Story = { render: () => <AllStates />, globals: { theme: "cava" } };

export const EnCola: Story = { args: { status: "PENDING" } };

/** `CHN_MINT_DISABLED`: la emisión espera en cola hasta que se habilite (contrato §0). */
export const EnColaConMotivo: Story = {
  args: {
    status: "PENDING",
    lastError: {
      code: "CHN_MINT_DISABLED",
      message: "La emisión en la red todavía no está habilitada.",
      retryable: true,
    },
  },
};

export const Preparando: Story = { args: { status: "BUILDING" } };

export const EnviadaALaRed: Story = { args: { status: "SUBMITTED", explorerUrl, attempts: 1 } };

export const Confirmada: Story = { args: { status: "CONFIRMED", explorerUrl, attempts: 1 } };

export const Reintentando: Story = {
  args: {
    status: "RETRYING",
    attempts: 3,
    lastError: {
      code: "CHN_RPC_UNAVAILABLE",
      message: "La red no respondió a tiempo.",
      retryable: true,
    },
  },
};

export const Fallida: Story = {
  args: {
    status: "FAILED",
    attempts: 6,
    explorerUrl,
    lastError: {
      code: "CHN_INSUFFICIENT_BALANCE",
      message: "La cuenta de operaciones no tiene saldo suficiente para la comisión.",
      retryable: true,
    },
  },
};

export const FallidaDefinitiva: Story = {
  args: {
    status: "FAILED",
    attempts: 1,
    lastError: {
      code: "CHN_CONTRACT_ERROR",
      message: "El contrato rechazó la operación.",
      retryable: false,
    },
  },
  globals: { theme: "cava" },
};

export const Grande: Story = { args: { status: "CONFIRMED", size: "lg", explorerUrl } };

/** Un estado que el paquete aún no conoce se muestra tal cual, en neutro. */
export const EstadoDesconocido: Story = { args: { status: "EXPIRED" } };

const cycle: TxStatus[] = ["PENDING", "BUILDING", "SUBMITTED", "CONFIRMED"];

function Lifecycle() {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setIndex((current) => Math.min(current + 1, cycle.length - 1));
    }, 1500);
    return () => clearInterval(timer);
  }, [running]);
  const status = cycle[index] ?? "PENDING";
  return (
    <div className="grid justify-items-start gap-4">
      <TxStatusBadge status={status} attempts={1} explorerUrl={index >= 2 ? explorerUrl : null} />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setIndex(0);
          setRunning(true);
        }}
      >
        Simular el ciclo
      </Button>
    </div>
  );
}

/**
 * La transacción avanza por consulta; cada cambio se anuncia una vez en la región
 * `aria-live="polite"` («Estado de la transacción: Confirmada»). El montaje no se anuncia.
 */
export const CicloAnunciado: Story = { render: () => <Lifecycle /> };
