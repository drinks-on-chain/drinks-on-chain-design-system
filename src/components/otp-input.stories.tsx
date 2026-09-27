import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Field } from "./field";
import { OtpInput } from "./otp-input";

const meta = {
  title: "Componentes/Formularios/OtpInput",
  component: OtpInput,
  args: { onComplete: fn() },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function Verify() {
  const [error, setError] = useState<string | undefined>();
  return (
    <Field
      label="Código de la app de autenticación"
      help="Seis cifras; también puedes pegarlo."
      error={error}
    >
      <OtpInput
        autoFocus
        onValueChange={() => setError(undefined)}
        onComplete={(code) => setError(code === "123456" ? undefined : "Código incorrecto")}
      />
    </Field>
  );
}

/** Prueba con 123456 (válido) o cualquier otro (error). */
export const ConField: Story = { render: () => <Verify /> };

export const Grande: Story = { args: { size: "lg", defaultValue: "482" } };

export const Desactivado: Story = { args: { disabled: true, defaultValue: "482913" } };

export const Cava: Story = { args: { defaultValue: "48" }, globals: { theme: "cava" } };
