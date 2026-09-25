import type { Meta, StoryObj } from "@storybook/react-vite";
import { Wordmark } from "./wordmark";

const meta = {
  title: "Componentes/Marca/Wordmark",
  component: Wordmark,
} satisfies Meta<typeof Wordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tamaños: Story = {
  render: () => (
    <div className="grid justify-items-start gap-4">
      <Wordmark size="sm" />
      <Wordmark size="md" />
      <Wordmark size="lg" />
      <Wordmark size="xl" />
      <Wordmark size="2xl" />
      <Wordmark size="lg" compact />
    </div>
  ),
};
