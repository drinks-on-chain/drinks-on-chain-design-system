import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyField } from "./copy-field";

const meta = {
  title: "Componentes/Formularios/CopyField",
  component: CopyField,
  args: {
    label: "Enlace de invitación",
    value: "https://backoffice.drinksonchain.test/invitacion/3f9a1c",
    help: "Caduca en 72 horas.",
    mono: false,
  },
  decorators: [(Story) => <div className="max-w-lg">{Story()}</div>],
} satisfies Meta<typeof CopyField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SecretoOculto: Story = {
  args: {
    label: "Clave TOTP",
    value: "JBSW Y3DP EHPK 3PXP",
    copyValue: "JBSWY3DPEHPK3PXP",
    masked: true,
    mono: true,
    help: undefined,
  },
};

export const Compacto: Story = {
  args: {
    size: "sm",
    label: undefined,
    "aria-label": "Hash",
    value: "77be0d4c…a91fc2",
    mono: true,
    help: undefined,
  },
};

export const Cava: Story = { globals: { theme: "cava" } };
