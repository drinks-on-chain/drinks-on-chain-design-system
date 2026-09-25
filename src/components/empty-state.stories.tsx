import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grape } from "lucide-react";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Componentes/Feedback/EmptyState",
  component: EmptyState,
  args: {
    title: "Aún no hay cosechas",
    description: "Registra la primera cosecha de este terroir para empezar a trazar sus lotes.",
    icon: <Grape aria-hidden />,
    action: <Button size="sm">Nueva cosecha</Button>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SinBorde: Story = { args: { bare: true, icon: undefined } };
