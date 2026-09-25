import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Pagination } from "./pagination";

const meta = {
  title: "Componentes/Navegación/Pagination",
  component: Pagination,
  args: { total: 48, limit: 20, offset: 0, onOffsetChange: fn() },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Estatica: Story = {};

function Controlled({ total, limit }: { total: number; limit: number }) {
  const [offset, setOffset] = useState(0);
  return <Pagination total={total} limit={limit} offset={offset} onOffsetChange={setOffset} />;
}

export const Interactiva: Story = { render: () => <Controlled total={1240} limit={20} /> };

export const SinResultados: Story = { args: { total: 0 } };
