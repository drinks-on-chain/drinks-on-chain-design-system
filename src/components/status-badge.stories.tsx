import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge, statusBadgeMap, type StatusKind } from "./status-badge";

const meta = {
  title: "Componentes/Estado/StatusBadge",
  component: StatusBadge,
  args: { kind: "winery", status: "ACTIVE" },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const titles: Record<StatusKind, string> = {
  application: "Solicitudes de alta",
  winery: "Bodegas",
  invitation: "Invitaciones",
  member: "Miembros",
  alert: "Alertas",
};

function AllStates() {
  return (
    <div className="grid gap-5">
      {(Object.keys(statusBadgeMap) as StatusKind[]).map((kind) => (
        <div key={kind} className="grid gap-2">
          <span className="text-2xs font-medium tracking-label text-fg-subtle uppercase">
            {titles[kind]} · <code className="font-mono normal-case">{kind}</code>
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.keys(statusBadgeMap[kind]).map((status) => (
              <StatusBadge key={status} kind={kind} status={status} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Todos los estados del contrato de la Ola 1, con contraste AA en los dos temas. */
export const Contrato: Story = { render: () => <AllStates /> };

export const ContratoCava: Story = { render: () => <AllStates />, globals: { theme: "cava" } };

export const EtiquetaPropia: Story = {
  args: { kind: "member", status: "BLOCKED", label: "Bloqueado por la plataforma" },
};
