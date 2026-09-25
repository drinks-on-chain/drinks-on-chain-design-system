import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ErrorState } from "./error-state";

const meta = {
  title: "Componentes/Feedback/ErrorState",
  component: ErrorState,
  args: { onRetry: fn() },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PorDefecto: Story = {};

export const ConDetalle: Story = {
  args: {
    title: "No se pudieron cargar los lotes",
    description: "El servidor no respondió a tiempo.",
    detail: "HTTP 504 · /api/v1/lots",
  },
};

export const Reintentando: Story = { args: { retrying: true } };
