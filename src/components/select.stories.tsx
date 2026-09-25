import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./field";
import { Select, SelectGroup, SelectItem, SelectSeparator } from "./select";

const meta = {
  title: "Componentes/Formularios/Select",
  component: Select,
  args: {
    placeholder: "Selecciona un terroir…",
    "aria-label": "Terroir",
    options: [
      { value: "cinti-02", label: "Cinti 02 · Los Parrales · Moscatel" },
      { value: "santa-ana-01", label: "Santa Ana 01 · La Angostura · Tannat" },
      { value: "concepcion-03", label: "Concepción 03 · El Portillo", disabled: true },
    ],
  },
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const EnField: Story = {
  render: (args) => (
    <Field label="Terroir de origen" help="Solo terroirs activos">
      <Select {...args} aria-label={undefined} size="lg" />
    </Field>
  ),
};

export const ConGrupos: Story = {
  args: { options: undefined, placeholder: "Punto de recojo" },
  render: (args) => (
    <Select {...args}>
      <SelectGroup label="Tarija">
        <SelectItem value="la-cava">Licorería La Cava</SelectItem>
        <SelectItem value="vinoteca-sur">Vinoteca Sur</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup label="Camargo">
        <SelectItem value="cinti-viejo">Destilería Cinti Viejo</SelectItem>
      </SelectGroup>
    </Select>
  ),
};
