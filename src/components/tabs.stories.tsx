import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Componentes/Navegación/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basicas: Story = {
  render: () => (
    <Tabs defaultValue="resumen" className="max-w-xl">
      <TabsList aria-label="Secciones del tanque">
        <TabsTrigger value="resumen">Resumen</TabsTrigger>
        <TabsTrigger value="bitacora">Bitácora</TabsTrigger>
        <TabsTrigger value="laboratorio">Laboratorio</TabsTrigger>
        <TabsTrigger value="archivo" disabled>
          Archivo
        </TabsTrigger>
      </TabsList>
      <TabsContent value="resumen" className="text-sm">
        Tanque 03 · fermentando, día 9 · 22,4 °C.
      </TabsContent>
      <TabsContent value="bitacora" className="text-sm">
        Tres registros diarios.
      </TabsContent>
      <TabsContent value="laboratorio" className="text-sm">
        Brix 23,4 · pH 3,40.
      </TabsContent>
    </Tabs>
  ),
};
