import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, SkeletonText } from "./skeleton";

const meta = {
  title: "Componentes/Feedback/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Formas: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <SkeletonText lines={3} />
      <div className="flex items-center gap-3">
        <Skeleton shape="circle" />
        <Skeleton className="w-40" />
      </div>
      <Skeleton shape="block" />
    </div>
  ),
};
