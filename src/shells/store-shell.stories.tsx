import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/button";
import { storeDesktopNavigation, storeTabs } from "../stories/navigation";
import { StoreShell } from "./store-shell";

const meta = {
  title: "Shells/StoreShell",
  component: StoreShell,
  parameters: { layout: "fullscreen" },
  args: {
    navigation: storeTabs,
    desktopNavigation: storeDesktopNavigation,
    currentPath: "/",
    headerActions: (
      <Button variant="secondary" size="sm">
        Entrar
      </Button>
    ),
    children: (
      <div className="px-5 py-6 md:px-8">
        <h1 className="m-0 font-display text-3xl font-medium">Catálogo</h1>
        <p className="text-fg-muted">Contenido editorial del escaparate.</p>
      </div>
    ),
  },
} satisfies Meta<typeof StoreShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Movil: Story = { globals: { viewport: { value: "sm375", isRotated: false } } };

export const Escritorio: Story = {};
