import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLink } from "../components/text-link";
import { PageShell } from "./page-shell";

const meta = {
  title: "Shells/PageShell",
  component: PageShell,
  parameters: { layout: "fullscreen" },
  args: {
    eyebrow: "Valle de Cinti",
    title: "Singani Gran Reserva",
    lead: "Moscatel de Alejandría cultivado a 2.350 metros.",
    children: (
      <>
        <p>
          Destilado en alambique de cobre, mil quinientos litros de corazón al sesenta por ciento,
          seis meses de reposo en acero. Notas de uva fresca, jazmín y cáscara de naranja.
        </p>
        <p>
          El singani reposa en tanques neutros de acero para redondear su perfil sin adquirir notas
          de madera. Seis meses inamovibles para la categoría Gran Reserva.
        </p>
        <p>
          <TextLink href="#" current>
            Ver la trazabilidad completa
          </TextLink>
        </p>
      </>
    ),
  },
} satisfies Meta<typeof PageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Prosa: Story = {};
