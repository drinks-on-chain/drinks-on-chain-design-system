import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../test/axe";
import { ChainAddress, getChainAddressKind, truncateMiddle } from "./chain-address";

// Con forma real, pero inventadas.
const account = "GDN3CAQ7XK2LJ5WZTPH4MVY6RBE3UOF2ISN7DGA5KXCLW2QPZTHV4SB6";
const contract = "CBQ5ZTVHTZPQ2WLCXK5AGD7NSI2FOU3EBR6YVM4HPTZW5JL2KX7QM7KD";
const txHash = "7506466e271ffe2576fe577888eba846e8db514716d682e5726d81c3e274bedf";
const explorerUrl = `https://explorer.example/account/${account}`;

describe("truncateMiddle y getChainAddressKind", () => {
  it("trunca por el medio con 6 y 4 caracteres por defecto", () => {
    expect(truncateMiddle(account)).toBe("GDN3CA…4SB6");
    expect(truncateMiddle(txHash, 8, 8)).toBe("7506466e…e274bedf");
    expect(truncateMiddle(account, 4, 0)).toBe("GDN3…");
  });

  it("no trunca lo que ya cabe", () => {
    expect(truncateMiddle("GDN3CA4SB6")).toBe("GDN3CA4SB6");
    expect(truncateMiddle("")).toBe("");
  });

  it("reconoce cuentas, contratos y hashes", () => {
    expect(account).toHaveLength(56);
    expect(getChainAddressKind(account)).toBe("account");
    expect(getChainAddressKind(contract)).toBe("contract");
    expect(getChainAddressKind(txHash)).toBe("hash");
    expect(getChainAddressKind(txHash.toUpperCase())).toBe("hash");
    expect(getChainAddressKind(account.slice(0, 55))).toBe("unknown");
    expect(getChainAddressKind("0x1234")).toBe("unknown");
  });
});

describe("ChainAddress", () => {
  it("muestra la dirección truncada y deja la completa a los lectores de pantalla", () => {
    const { container } = render(<ChainAddress value={account} label="Cuenta de la bodega" />);
    const short = screen.getByText("GDN3CA…4SB6");
    expect(short).toHaveAttribute("aria-hidden", "true");
    expect(short).toHaveAttribute("title", account);
    const full = screen.getByText(account);
    expect(full).toHaveClass("sr-only");
    expect(screen.getByText("Cuenta de la bodega:")).toHaveClass("sr-only");
    expect(container.firstElementChild).toHaveAttribute("data-kind", "account");
    expect(container.querySelector("[data-part=value]")).toHaveClass("font-mono");
  });

  it("truncate={false} muestra la dirección entera una sola vez", () => {
    render(<ChainAddress value={account} truncate={false} />);
    expect(screen.getAllByText(account)).toHaveLength(1);
    expect(screen.getByText(account)).not.toHaveClass("sr-only");
  });

  it("el botón copia la dirección completa y lo anuncia", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(<ChainAddress value={account} onCopy={onCopy} />);
    await user.click(screen.getByRole("button", { name: "Copiar dirección GDN3CA…4SB6" }));
    expect(await navigator.clipboard.readText()).toBe(account);
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent("Copiado");
  });

  it("un hash usa «Copiar hash»", () => {
    render(<ChainAddress value={txHash} />);
    expect(screen.getByRole("button", { name: "Copiar hash 750646…bedf" })).toBeInTheDocument();
  });

  it("seleccionar el texto truncado y copiar lleva la dirección completa al portapapeles", () => {
    const { container } = render(<ChainAddress value={account} />);
    const target = container.querySelector("[data-part=value]") as HTMLElement;
    const setData = vi.fn();
    const event = createEvent.copy(target, { clipboardData: { setData } });
    fireEvent(target, event);
    expect(setData).toHaveBeenCalledWith("text/plain", account);
    expect(event.defaultPrevented).toBe(true);
  });

  it("copyable={false} quita el botón y su región viva", () => {
    render(<ChainAddress value={account} copyable={false} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("con explorerUrl añade un enlace externo seguro con nombre accesible", () => {
    render(<ChainAddress value={account} explorerUrl={explorerUrl} />);
    const link = screen.getByRole("link", {
      name: "Ver en el explorador GDN3CA…4SB6 (se abre en una pestaña nueva)",
    });
    expect(link).toHaveAttribute("href", explorerUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("sin explorerUrl no hay enlace", () => {
    render(<ChainAddress value={account} explorerUrl={null} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("no tiene violaciones de axe", async () => {
    render(
      <dl>
        <dt>Cuenta</dt>
        <dd>
          <ChainAddress value={account} label="Cuenta de la bodega" explorerUrl={explorerUrl} />
        </dd>
        <dt>Contrato</dt>
        <dd>
          <ChainAddress value={contract} label="Contrato NFT" truncate={false} />
        </dd>
        <dt>Transacción</dt>
        <dd>
          <ChainAddress value={txHash} copyable={false} />
        </dd>
      </dl>,
    );
    await expectNoAxeViolations();
  });
});
