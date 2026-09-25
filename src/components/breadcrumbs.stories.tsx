import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "./breadcrumbs";

const meta = {
  title: "Componentes/Navegación/Breadcrumbs",
  component: Breadcrumbs,
  args: {
    items: [
      { label: "Vinificación", href: "#vinificacion" },
      { label: "Tanques", href: "#tanques" },
      { label: "Tanque 03" },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
