import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExplorerLink } from "./explorer-link";

const meta = {
  title: "Componentes/Acciones/ExplorerLink",
  component: ExplorerLink,
  // Dominio de ejemplo: en las apps la URL completa la devuelve el backend (`explorerUrl`).
  args: { href: "https://explorer.example/tx/7506466e271ffe25" },
} satisfies Meta<typeof ExplorerLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TextoPropio: Story = { args: { children: "Ver el contrato en el explorador" } };

/** Solo el icono; el texto queda para lectores de pantalla. */
export const SoloIcono: Story = { args: { iconOnly: true } };
