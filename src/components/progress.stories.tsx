import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./progress";

const meta = {
  title: "Componentes/Feedback/Progress",
  component: Progress,
  args: { value: 62, label: "Reposo completado" },
  decorators: [(Story) => <div className="max-w-md">{Story()}</div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tonos: Story = {
  render: () => (
    <div className="grid gap-4">
      <Progress value={22} label="Reposo" valueText="22 %" />
      <Progress value={82} tone="warning" label="Barrica" valueText="Faltan 38 días" />
      <Progress value={100} tone="success" label="Completado" />
      <Progress label="Creando tu billetera" />
    </div>
  ),
};
