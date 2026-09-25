import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";

const meta = {
  title: "Componentes/Estado/Avatar",
  component: Avatar,
  args: { name: "Lucía Rojas" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tamaños: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="sm" name="Ana Gutiérrez" />
      <Avatar name="Lucía Rojas" />
      <Avatar size="lg" name="Juan Pérez" />
    </div>
  ),
};
