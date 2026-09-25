import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "./tag";

const meta = {
  title: "Componentes/Estado/Tag",
  component: Tag,
  args: { children: "Moscatel" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Varias: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag>Vino</Tag>
      <Tag>Singani</Tag>
      <Tag>Tannat</Tag>
      <Tag>Roble francés</Tag>
    </div>
  ),
};
