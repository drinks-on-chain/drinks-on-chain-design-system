import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyField } from "./copy-field";

describe("CopyField", () => {
  it("copia el valor y anuncia «Copiado»", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(
      <CopyField label="Enlace de invitación" value="https://erp.test/i/abc" onCopy={onCopy} />,
    );
    const input = screen.getByRole("textbox", { name: "Enlace de invitación" });
    expect(input).toHaveAttribute("readonly");
    await user.click(screen.getByRole("button", { name: "Copiar" }));
    expect(await navigator.clipboard.readText()).toBe("https://erp.test/i/abc");
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent("Copiado");
    expect(screen.getByRole("button", { name: "Copiado" })).toBeInTheDocument();
  });

  it("masked no pone el secreto en el DOM hasta mostrarlo", async () => {
    const user = userEvent.setup();
    render(<CopyField aria-label="Secreto" value="JBSWY3DPEHPK3PXP" masked />);
    const input = screen.getByRole("textbox", { name: "Secreto" });
    expect(input).not.toHaveValue("JBSWY3DPEHPK3PXP");
    const toggle = screen.getByRole("button", { name: "Mostrar" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(input).toHaveValue("JBSWY3DPEHPK3PXP");
    expect(screen.getByRole("button", { name: "Ocultar" })).toHaveAttribute("aria-pressed", "true");
  });

  it("copia copyValue si difiere de lo mostrado", async () => {
    const user = userEvent.setup();
    render(<CopyField aria-label="Secreto" value="JBSW Y3DP" copyValue="JBSWY3DP" />);
    await user.click(screen.getByRole("button", { name: "Copiar" }));
    expect(await navigator.clipboard.readText()).toBe("JBSWY3DP");
  });
});
