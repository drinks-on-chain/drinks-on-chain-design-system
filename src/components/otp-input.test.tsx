import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Field } from "./field";
import { OtpInput, sanitizeOtp } from "./otp-input";

describe("sanitizeOtp", () => {
  it("deja solo cifras y recorta", () => {
    expect(sanitizeOtp("123 456")).toBe("123456");
    expect(sanitizeOtp("12-34-56-78")).toBe("123456");
    expect(sanitizeOtp("ab1c", 6, "alphanumeric")).toBe("AB1C");
  });
});

describe("OtpInput", () => {
  it("es un solo campo con autocomplete one-time-code y teclado numérico", () => {
    render(<OtpInput />);
    const input = screen.getByRole("textbox", { name: "Código de verificación" });
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    expect(input).toHaveAttribute("inputmode", "numeric");
  });

  it("toma la etiqueta y el error del Field", () => {
    render(
      <Field label="Código de la app" error="Código incorrecto">
        <OtpInput />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Código de la app" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Código incorrecto");
  });

  it("avanza al escribir, ignora letras y avisa al completar", async () => {
    const onComplete = vi.fn();
    const onValueChange = vi.fn();
    render(<OtpInput onComplete={onComplete} onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "12a3");
    expect(input).toHaveValue("123");
    expect(onComplete).not.toHaveBeenCalled();
    await userEvent.type(input, "4567");
    expect(input).toHaveValue("123456");
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("123456");
  });

  it("pegar un código con espacios lo reparte en las casillas", async () => {
    const onComplete = vi.fn();
    render(<OtpInput onComplete={onComplete} />);
    const input = screen.getByRole("textbox");
    await userEvent.click(input);
    await userEvent.paste("482 913");
    expect(input).toHaveValue("482913");
    expect(onComplete).toHaveBeenCalledWith("482913");
  });

  it("Retroceso borra el último dígito", async () => {
    render(<OtpInput defaultValue="1234" />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "{Backspace}");
    expect(input).toHaveValue("123");
  });
});
