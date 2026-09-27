import type { Meta, StoryObj } from "@storybook/react-vite";
import { RoleMatrix, type RoleMatrixCapability } from "./role-matrix";

const roles = [
  { key: "SUPERADMIN", label: "Superadmin" },
  { key: "ADMIN", label: "Admin" },
  { key: "OPERATIONS", label: "Operaciones" },
  { key: "SUPPORT", label: "Soporte" },
  { key: "OWNER", label: "Dueño" },
  { key: "ENOLOGIST", label: "Otros de bodega" },
];

/** Resumen de permisos de la Ola 1 (contrato O1 §9). */
const capabilities: RoleMatrixCapability[] = [
  {
    key: "platform.users",
    label: "Usuarios internos",
    roles: { SUPERADMIN: "FULL", ADMIN: "FULL" },
  },
  {
    key: "platform.settings",
    label: "Configuración",
    description: "Estándar, ajustes por bodega, excepción legal",
    roles: {
      SUPERADMIN: "FULL",
      ADMIN: "FULL",
      OPERATIONS: "READ",
      SUPPORT: "READ",
      OWNER: "READ",
      ENOLOGIST: "READ",
    },
  },
  {
    key: "platform.applications",
    label: "Solicitudes y alta de bodegas",
    roles: { SUPERADMIN: "FULL", ADMIN: "FULL", OPERATIONS: "FULL", SUPPORT: "READ" },
  },
  {
    key: "platform.wineries.suspend",
    label: "Suspender / reactivar bodega",
    roles: { SUPERADMIN: "FULL", ADMIN: "FULL", OPERATIONS: "FULL" },
  },
  {
    key: "platform.wineries.revoke",
    label: "Revocar, transferir titularidad, bloquear cuenta",
    roles: { SUPERADMIN: "FULL", ADMIN: "FULL" },
  },
  {
    key: "org.team",
    label: "Equipo de una bodega",
    roles: {
      SUPERADMIN: "FULL",
      ADMIN: "FULL",
      OPERATIONS: "FULL",
      SUPPORT: "FULL",
      OWNER: "OWN",
      ENOLOGIST: "READ",
    },
  },
  {
    key: "audit",
    label: "Bitácora",
    roles: {
      SUPERADMIN: "FULL",
      ADMIN: "FULL",
      OPERATIONS: "FULL",
      SUPPORT: "FULL",
      OWNER: "OWN",
    },
  },
];

const meta = {
  title: "Componentes/Datos/RoleMatrix",
  component: RoleMatrix,
  args: { capabilities, roles, highlightRole: "OPERATIONS" },
} satisfies Meta<typeof RoleMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compacta: Story = {};

export const Comoda: Story = { args: { density: "comfortable", highlightRole: undefined } };

export const Cava: Story = { globals: { theme: "cava" } };

/**
 * En un contenedor estrecho la tabla desborda: el contenedor desplazable entra en el orden de
 * tabulación (región con el nombre de la tabla y foco visible) para recorrerlo con las flechas.
 */
export const Desbordada: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-[420px]">
        <Story />
      </div>
    ),
  ],
};
