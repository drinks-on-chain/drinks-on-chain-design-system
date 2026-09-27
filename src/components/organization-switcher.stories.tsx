import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OrganizationSwitcher, type OrganizationOption } from "./organization-switcher";
import { StatusBadge } from "./status-badge";

const organizations: OrganizationOption[] = [
  { id: "platform", name: "Drinks on Chain", description: "Plataforma · ADMIN" },
  {
    id: "w1",
    name: "Destilería Cinti Viejo",
    description: "Bodega · OWNER",
    badge: <StatusBadge kind="winery" status="ACTIVE" />,
  },
  {
    id: "w2",
    name: "Bodega Altos de Calamuchita",
    description: "Bodega · ENOLOGIST",
    badge: <StatusBadge kind="winery" status="SUSPENDED" />,
  },
];

function Demo({ list = organizations }: { list?: OrganizationOption[] }) {
  const [active, setActive] = useState("platform");
  return <OrganizationSwitcher organizations={list} activeId={active} onChange={setActive} />;
}

const meta = {
  title: "Componentes/Navegación/OrganizationSwitcher",
  component: OrganizationSwitcher,
  args: { organizations, activeId: "platform", onChange: () => {} },
} satisfies Meta<typeof OrganizationSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Varias: Story = { render: () => <Demo /> };

export const Una: Story = { render: () => <Demo list={organizations.slice(0, 1)} /> };

export const Cava: Story = { render: () => <Demo />, globals: { theme: "cava" } };
