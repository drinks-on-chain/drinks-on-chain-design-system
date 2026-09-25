import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/button";
import { Field } from "../components/field";
import { Input } from "../components/input";
import { AuthLayout } from "./auth-layout";

const loginForm = (
  <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
    <Field label="Correo electrónico">
      <Input size="lg" type="email" placeholder="nombre@bodega.bo" autoComplete="username" />
    </Field>
    <Field label="Contraseña">
      <Input size="lg" type="password" autoComplete="current-password" />
    </Field>
    <Button type="submit" size="lg" block>
      Iniciar sesión
    </Button>
    <Button variant="tertiary">¿Olvidaste tu contraseña?</Button>
  </form>
);

const meta = {
  title: "Shells/AuthLayout",
  component: AuthLayout,
  parameters: { layout: "fullscreen" },
  args: { children: loginForm },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DivididoERP: Story = {
  args: {
    variant: "split",
    eyebrow: "ERP de trazabilidad",
    imageCaption: (
      <>
        <p className="m-0 mb-1.5 font-display text-sm tracking-eyebrow text-fg-muted uppercase">
          Valle de Cinti · 2.350 m
        </p>
        <p className="m-0 font-display text-3xl leading-tight font-medium">
          La verdad física del producto, de la tierra a la botella.
        </p>
      </>
    ),
    footer:
      "Acceso exclusivo para bodegas asociadas. Si tu bodega no tiene credenciales, contacta con el equipo de Drinks on Chain.",
  },
};

export const CentradoBackoffice: Story = {
  args: { variant: "centered", eyebrow: "Backoffice", title: "Entrar" },
};

export const VeladoMarketplace: Story = {
  globals: { viewport: { value: "sm375", isRotated: false } },
  args: {
    variant: "veiled",
    eyebrow: "Únete a la tribu",
    title: "Tu cava digital en menos de un minuto.",
    children: (
      <div className="grid gap-3">
        <Input
          size="lg"
          type="tel"
          placeholder="Número de teléfono"
          aria-label="Número de teléfono"
        />
        <Input
          size="lg"
          type="email"
          placeholder="Correo electrónico"
          aria-label="Correo electrónico"
        />
        <Button size="lg" block>
          Continuar
        </Button>
      </div>
    ),
    footer: "¿Ya tienes cuenta? Inicia sesión · Al continuar aceptas los términos.",
  },
};

export const PinPOS: Story = {
  globals: { viewport: { value: "lg1024", isRotated: false } },
  args: {
    variant: "pin",
    eyebrow: "Licorería La Cava · mostrador 1",
    title: "Abrir turno",
    description: "Introduce tu PIN para abrir el turno",
    children: (
      <div className="grid grid-cols-3 gap-3.5">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((key, index) =>
          key ? (
            <Button key={index} variant="secondary" className="size-24 rounded-lg text-4xl">
              {key}
            </Button>
          ) : (
            <span key={index} />
          ),
        )}
      </div>
    ),
  },
};
