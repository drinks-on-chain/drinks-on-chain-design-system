import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { groupSecret, SecretReveal } from "./secret-reveal";

const codes = ["7KQ2-M9XA", "P3RT-8WLC", "D6YH-2NFE", "Q9VB-4JSU"];

describe("groupSecret", () => {
  it("agrupa de cuatro en cuatro", () => {
    expect(groupSecret("JBSWY3DPEHPK3PXP")).toBe("JBSW Y3DP EHPK 3PXP");
    expect(groupSecret("ABCDEF")).toBe("ABCD EF");
  });
});

describe("SecretReveal", () => {
  it("muestra el QR, el secreto agrupado y los códigos en una lista", () => {
    render(
      <SecretReveal
        secret="JBSWY3DPEHPK3PXP"
        otpauthUrl="otpauth://totp/Drinks%20on%20Chain:ana?secret=JBSWY3DPEHPK3PXP"
        codes={codes}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Código QR para la app de autenticación" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Clave de configuración" })).toHaveValue(
      "JBSW Y3DP EHPK 3PXP",
    );
    const list = screen.getByRole("region", { name: "Códigos de recuperación" });
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByRole("note")).toHaveTextContent("Se muestra una sola vez");
  });

  it("copia el secreto sin espacios y todos los códigos", async () => {
    const user = userEvent.setup();
    render(<SecretReveal secret="JBSWY3DPEHPK3PXP" codes={codes} />);
    await user.click(screen.getByRole("button", { name: "Copiar" }));
    expect(await navigator.clipboard.readText()).toBe("JBSWY3DPEHPK3PXP");
    await user.click(screen.getByRole("button", { name: "Copiar todos" }));
    expect(await navigator.clipboard.readText()).toBe(codes.join("\n"));
  });

  it("la casilla de confirmación informa del cambio", async () => {
    const onAcknowledgedChange = vi.fn();
    render(<SecretReveal codes={codes} onAcknowledgedChange={onAcknowledgedChange} />);
    await userEvent.click(
      screen.getByRole("checkbox", { name: "He guardado esta información en un lugar seguro" }),
    );
    expect(onAcknowledgedChange).toHaveBeenCalledWith(true);
  });
});
