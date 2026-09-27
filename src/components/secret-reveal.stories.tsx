import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { SecretReveal } from "./secret-reveal";

const secret = "JBSWY3DPEHPK3PXP";
const otpauthUrl = `otpauth://totp/Drinks%20on%20Chain:ana%40drinksonchain.test?secret=${secret}&issuer=Drinks%20on%20Chain`;
const codes = [
  "7KQ2-M9XA",
  "P3RT-8WLC",
  "D6YH-2NFE",
  "Q9VB-4JSU",
  "H2MX-7RKD",
  "W8CL-3TQP",
  "N5FZ-6BYG",
  "R4JE-9VHA",
  "T7US-1KWM",
  "B3GD-5XPN",
];

const meta = {
  title: "Componentes/Datos/SecretReveal",
  component: SecretReveal,
  args: { secret, otpauthUrl },
  decorators: [(Story) => <div className="max-w-xl">{Story()}</div>],
} satisfies Meta<typeof SecretReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Paso 1 del enrolamiento: QR y clave para la app de autenticación. */
export const SecretoTotp: Story = { args: { hideAcknowledge: true } };

/** Tras confirmar el enrolamiento: los 10 códigos de recuperación, una sola vez. */
export const CodigosDeRecuperacion: Story = {
  args: { secret: undefined, otpauthUrl: undefined, codes },
};

function Flow() {
  const [saved, setSaved] = useState(false);
  return (
    <Card className="grid gap-5">
      <h2 className="m-0 font-display text-2xl font-medium">Guarda tus códigos de recuperación</h2>
      <SecretReveal codes={codes} acknowledged={saved} onAcknowledgedChange={setSaved} />
      <Button className="justify-self-end" disabled={!saved}>
        Continuar al tablero
      </Button>
    </Card>
  );
}

export const ConConfirmacion: Story = { render: () => <Flow /> };

export const Cava: Story = { args: { codes }, globals: { theme: "cava" } };
