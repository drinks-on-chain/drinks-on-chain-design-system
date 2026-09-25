import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardHeader } from "./card";
import { KeyValueList } from "./key-value-list";

const meta = {
  title: "Componentes/Datos/Card",
  component: Card,
  args: { children: "Superficie: sin sombra, hairline", className: "max-w-xs" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variantes: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-4 md:grid-cols-3">
      <Card>
        <CardHeader title="Cinti 02 · Los Parrales" description="Moscatel de Alejandría" />
        <KeyValueList
          items={[
            { term: "Altitud", value: "2.350 m" },
            { term: "Superficie", value: "4,2 ha" },
          ]}
        />
      </Card>
      <Card selected>
        <CardHeader title="Seleccionada" action={<Badge tone="accent">D.O.</Badge>} />
        <p className="m-0 text-sm text-fg-muted">Borde y trazo interior en oro.</p>
      </Card>
      <Card variant="flat" radius="lg">
        <CardHeader title="Plana, radio lg" />
        <Button size="sm" variant="secondary">
          Mostrar
        </Button>
      </Card>
    </div>
  ),
};
