import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Field } from "./field";
import { FormSection } from "./form-section";
import { Input } from "./input";

const meta = {
  title: "Componentes/Formularios/FormSection",
  component: FormSection,
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Embotellado: Story = {
  args: { title: "Ajuste de graduación" },
  render: () => (
    <div className="grid max-w-3xl gap-6">
      <FormSection title="Ajuste de graduación" description="De 60 % a 40 % vol." columns={2}>
        <Field label="Adición de agua" help="Ajuste de 60 % a 40 % vol">
          <Input numeric defaultValue="750" suffix="L" />
        </Field>
        <Field label="Botellas llenadas (750 ml)">
          <Input numeric defaultValue="2.200" suffix="ud" />
        </Field>
      </FormSection>
      <FormSection
        title="Cortes del alambique"
        columns={3}
        actions={<Button>Guardar cortes</Button>}
      >
        <Field label="Cabeza">
          <Input numeric defaultValue="120" suffix="L" />
        </Field>
        <Field label="Corazón">
          <Input numeric defaultValue="1.500" suffix="L" />
        </Field>
        <Field label="Cola">
          <Input numeric defaultValue="210" suffix="L" />
        </Field>
      </FormSection>
    </div>
  ),
};
