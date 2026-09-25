import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrandSeal } from "./brand-seal";
import { GlassBottleOrnament, VineOrnament } from "./ink-ornaments";
import { VineyardScene } from "./vineyard-scene";

const meta = {
  title: "Componentes/Marca/Editoriales",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Chapa: Story = {
  render: () => (
    <div className="grid justify-items-center gap-10 py-6">
      <BrandSeal size="lg" />
      <BrandSeal tagline="ERP de trazabilidad" />
      <BrandSeal size="sm" tagline="Backoffice" />
    </div>
  ),
};

export const Ornamentos: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <VineOrnament className="w-72" />
      <GlassBottleOrnament className="w-72" />
    </div>
  ),
};

export const EscenaDeViñedo: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="h-[720px] w-full max-w-[720px]">
      <VineyardScene />
    </div>
  ),
};
