import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { ThemeProvider, useTheme } from "./theme-provider";

const meta = {
  title: "Fundamentos/ThemeProvider",
  component: ThemeProvider,
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Toggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Card className="grid max-w-sm gap-3">
      <span className="text-sm">
        Tema actual: <Badge tone="accent">{theme === "oro" ? "Oro Líquido" : "Cava Reserva"}</Badge>
      </span>
      <Button onClick={() => setTheme(theme === "oro" ? "cava" : "oro")}>Cambiar tema</Button>
    </Card>
  );
}

export const ContenedorLocal: Story = {
  render: () => (
    <ThemeProvider scope="element" defaultTheme="cava" className="rounded-md p-6">
      <Toggle />
    </ThemeProvider>
  ),
};
