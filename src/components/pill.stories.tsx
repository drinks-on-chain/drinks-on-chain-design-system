import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pill, PillGroup } from "./pill";

const meta = {
  title: "Componentes/Estado/Pill",
  component: Pill,
  args: { children: "Moscatel", pressed: true },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function Filters({ size }: { size?: "sm" | "md" }) {
  const options = ["Todas", "Moscatel", "Tannat", "Syrah"];
  const [active, setActive] = useState("Todas");
  return (
    <PillGroup label="Filtrar por cepa">
      {options.map((option) => (
        <Pill
          key={option}
          size={size}
          pressed={active === option}
          onPressedChange={() => setActive(option)}
        >
          {option}
        </Pill>
      ))}
    </PillGroup>
  );
}

export const Filtros: Story = { render: () => <Filters /> };

export const Compactos: Story = { render: () => <Filters size="sm" /> };
