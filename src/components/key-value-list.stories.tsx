import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { KeyValueList } from "./key-value-list";

const meta = {
  title: "Componentes/Datos/KeyValueList",
  component: KeyValueList,
  args: {
    items: [
      { term: "Razón social", value: "Destilería Cinti Viejo S.R.L." },
      { term: "Región", value: "Valle de Cinti · Camargo" },
      { term: "Contacto", value: "Lucía Rojas · enóloga" },
      {
        term: "Terroir",
        value: (
          <>
            Los Parrales · 2.350 m{" "}
            <Badge tone="accent" dot={false}>
              D.O.
            </Badge>
          </>
        ),
      },
    ],
  },
} satisfies Meta<typeof KeyValueList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnLinea: Story = {};

export const Apilada: Story = { args: { layout: "stacked" } };
