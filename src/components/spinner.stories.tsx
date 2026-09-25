import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./spinner";

const meta = {
  title: "Componentes/Feedback/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tamaños: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-accent-text">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  ),
};
