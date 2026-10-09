import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../test/axe";
import {
  getTxStatus,
  isTxInProgress,
  TxStatusBadge,
  type TxStatus,
  type TxStatusBadgeProps,
} from "./tx-status-badge";

const explorerUrl = "https://explorer.example/tx/abc123";

const contractLabels: Record<TxStatus, string> = {
  PENDING: "En cola",
  BUILDING: "Preparando",
  SUBMITTED: "Enviada a la red",
  CONFIRMED: "Confirmada",
  RETRYING: "Reintentando",
  FAILED: "Fallida",
};
const statuses = Object.keys(contractLabels) as TxStatus[];

// Forma de `ChainTxRef` (contrato O3 §2.3): debe poder pasarse sin adaptar.
interface ChainTxRefLike {
  id: string;
  status: "PENDING" | "BUILDING" | "SUBMITTED" | "CONFIRMED" | "RETRYING" | "FAILED";
  txHash: string | null;
  explorerUrl: string | null;
  attempts: number;
  lastError: { code: string; message: string; retryable: boolean } | null;
}

describe("TxStatusBadge", () => {
  it("usa las etiquetas exactas del contrato y marca el estado", () => {
    for (const status of statuses) {
      expect(getTxStatus(status).label).toBe(contractLabels[status]);
      const { unmount, container } = render(<TxStatusBadge status={status} />);
      expect(screen.getByText(contractLabels[status])).toBeInTheDocument();
      expect(container.firstElementChild).toHaveAttribute("data-status", status);
      unmount();
    }
  });

  it("el estado lleva icono decorativo además del texto", () => {
    for (const status of statuses) {
      const { unmount } = render(<TxStatusBadge status={status} />);
      const icon = screen.getByText(contractLabels[status]).querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
      unmount();
    }
  });

  it("el indicador en curso solo anima transform u opacity y se detiene con reduced-motion", () => {
    const animated: Partial<Record<TxStatus, string>> = {
      BUILDING: "animate-spin",
      SUBMITTED: "animate-pulse",
      RETRYING: "animate-spin",
    };
    for (const status of statuses) {
      const { unmount } = render(<TxStatusBadge status={status} />);
      const icon = screen.getByText(contractLabels[status]).querySelector("svg");
      const expected = animated[status];
      if (expected) {
        expect(icon).toHaveClass(expected, "motion-reduce:animate-none");
      } else {
        expect(icon?.getAttribute("class")).not.toMatch(/animate-/);
      }
      unmount();
    }
  });

  it("distingue los estados en curso de los finales", () => {
    expect(statuses.filter(isTxInProgress)).toEqual([
      "PENDING",
      "BUILDING",
      "SUBMITTED",
      "RETRYING",
    ]);
  });

  it("un estado desconocido se muestra tal cual en neutro", () => {
    expect(getTxStatus("EXPIRED")).toEqual({
      label: "EXPIRED",
      tone: "neutral",
      inProgress: false,
    });
    render(<TxStatusBadge status="EXPIRED" />);
    expect(screen.getByText("EXPIRED")).toBeInTheDocument();
  });

  it("con explorerUrl añade un enlace externo seguro que avisa de la pestaña nueva", () => {
    render(<TxStatusBadge status="CONFIRMED" explorerUrl={explorerUrl} />);
    const link = screen.getByRole("link", {
      name: "Ver en el explorador (se abre en una pestaña nueva)",
    });
    expect(link).toHaveAttribute("href", explorerUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("sin explorerUrl, o con una URL que no es http(s), no hay enlace", () => {
    const { rerender } = render(<TxStatusBadge status="SUBMITTED" explorerUrl={null} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    rerender(<TxStatusBadge status="SUBMITTED" explorerUrl="javascript:alert(1)" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("muestra lastError como texto visible, con su código", () => {
    render(
      <TxStatusBadge
        status="FAILED"
        lastError={{
          code: "CHN_INSUFFICIENT_BALANCE",
          message: "Saldo insuficiente para la comisión.",
          retryable: true,
        }}
      />,
    );
    const error = screen.getByText(/Saldo insuficiente para la comisión\./);
    expect(error).not.toHaveClass("sr-only");
    expect(error).not.toHaveAttribute("title");
    expect(error).toHaveTextContent(
      "Saldo insuficiente para la comisión. (Código: CHN_INSUFFICIENT_BALANCE) Se puede reintentar.",
    );
  });

  it("la nota de reintento solo aparece en una fallida reintentable", () => {
    const lastError = {
      code: "CHN_CONTRACT_ERROR",
      message: "El contrato rechazó.",
      retryable: false,
    };
    const { rerender } = render(<TxStatusBadge status="FAILED" lastError={lastError} />);
    expect(screen.queryByText(/Se puede reintentar/)).not.toBeInTheDocument();
    rerender(<TxStatusBadge status="RETRYING" lastError={{ ...lastError, retryable: true }} />);
    expect(screen.queryByText(/Se puede reintentar/)).not.toBeInTheDocument();
  });

  it("muestra los intentos a partir del segundo", () => {
    const { rerender } = render(<TxStatusBadge status="RETRYING" attempts={1} />);
    expect(screen.queryByText(/Intento/)).not.toBeInTheDocument();
    rerender(<TxStatusBadge status="RETRYING" attempts={3} />);
    expect(screen.getByText("Intento 3")).toBeInTheDocument();
  });

  it("anuncia los cambios de estado con aria-live polite, no el montaje ni los rerenders", () => {
    const { rerender } = render(<TxStatusBadge status="PENDING" />);
    const live = screen.getByRole("status");
    expect(live).toHaveAttribute("aria-live", "polite");
    expect(live).toBeEmptyDOMElement();

    rerender(<TxStatusBadge status="PENDING" attempts={1} />);
    expect(live).toBeEmptyDOMElement();

    rerender(<TxStatusBadge status="SUBMITTED" />);
    expect(live).toHaveTextContent("Estado de la transacción: Enviada a la red");

    rerender(
      <TxStatusBadge
        status="FAILED"
        lastError={{ code: "CHN_AUTH_FAILED", message: "Firma inválida", retryable: false }}
      />,
    );
    expect(live).toHaveTextContent("Estado de la transacción: Fallida. Firma inválida");
  });

  it("announce={false} quita la región viva (listas con muchas transacciones)", () => {
    render(<TxStatusBadge status="PENDING" announce={false} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("admite sustituir etiquetas y textos", () => {
    render(
      <TxStatusBadge
        status="CONFIRMED"
        explorerUrl={explorerUrl}
        attempts={2}
        labels={{
          status: { CONFIRMED: "Emitida" },
          explorer: "Ver la emisión",
          attempts: (attempts) => `${attempts} intentos`,
        }}
      />,
    );
    expect(screen.getByText("Emitida")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver la emisión/ })).toBeInTheDocument();
    expect(screen.getByText("2 intentos")).toBeInTheDocument();
  });

  it("acepta los campos de un ChainTxRef sin adaptarlos", () => {
    const tx: ChainTxRefLike = {
      id: "tx-1",
      status: "RETRYING",
      txHash: null,
      explorerUrl: null,
      attempts: 2,
      lastError: { code: "CHN_TX_TIMEOUT", message: "Tiempo agotado.", retryable: true },
    };
    const props: TxStatusBadgeProps = {
      status: tx.status,
      explorerUrl: tx.explorerUrl,
      lastError: tx.lastError,
      attempts: tx.attempts,
    };
    render(<TxStatusBadge {...props} />);
    expect(screen.getByText("Reintentando")).toBeInTheDocument();
  });

  it("no tiene violaciones de axe en ningún estado", async () => {
    render(
      <ul>
        {statuses.map((status) => (
          <li key={status}>
            <TxStatusBadge
              status={status}
              attempts={3}
              explorerUrl={explorerUrl}
              lastError={{
                code: "CHN_RPC_UNAVAILABLE",
                message: "La red no respondió.",
                retryable: true,
              }}
            />
          </li>
        ))}
      </ul>,
    );
    await expectNoAxeViolations();
  });
});
