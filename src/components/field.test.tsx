import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./field";
import { Input, Textarea } from "./input";
import { RadioGroup } from "./radio-group";

describe("Field", () => {
  it("asocia la etiqueta con el control", () => {
    render(
      <Field label="Correo electrónico">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText("Correo electrónico")).toBeInstanceOf(HTMLInputElement);
  });

  it("describe el control con la ayuda y marca required", () => {
    render(
      <Field label="Correo" help="Usaremos este correo para las credenciales." required>
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText(/Correo/);
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription("Usaremos este correo para las credenciales.");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("con error marca aria-invalid y antepone el error a la ayuda", () => {
    render(
      <Field label="Contraseña" help="Mínimo 8 caracteres" error="La contraseña no es correcta.">
        <Input type="password" />
      </Field>,
    );
    const input = screen.getByLabelText("Contraseña");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("La contraseña no es correcta. Mínimo 8 caracteres");
  });

  it("respeta el id y aria-describedby propios del control", () => {
    render(
      <>
        <p id="extra">Nota externa</p>
        <Field label="Notas" help="Opcional">
          <Textarea id="notas" aria-describedby="extra" />
        </Field>
      </>,
    );
    const textarea = screen.getByLabelText("Notas");
    expect(textarea).toHaveAttribute("id", "notas");
    expect(textarea).toHaveAccessibleDescription("Opcional Nota externa");
  });

  it("nombra un RadioGroup con la etiqueta del Field", () => {
    render(
      <Field label="Tipo de producto">
        <RadioGroup
          options={[
            { value: "vino", label: "Vino" },
            { value: "singani", label: "Singani" },
          ]}
        />
      </Field>,
    );
    expect(screen.getByRole("radiogroup", { name: "Tipo de producto" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });
});
