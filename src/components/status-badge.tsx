import type { Tone } from "../lib/types";
import { Badge, type BadgeProps } from "./badge";

// Estados del contrato de la Ola 1 (plan/contratos/o1-backoffice-y-bodegas.md §2–§5) y de la
// solicitud de tokenización de la Ola 3 (plan/contratos/o3-tokenizacion.md §5.1) mapeados a los
// tonos de estado. Los badges suaves usan los tokens `*-text` sobre `*-soft`: contraste AA
// en los dos temas (0.2.0).

export interface StatusDefinition {
  label: string;
  tone: Tone;
}

/** Etiqueta y tono por defecto de cada estado, por tipo de recurso. */
export const statusBadgeMap = {
  /** `ApplicationStatus` · solicitudes de alta (§3). */
  application: {
    UNVERIFIED: { label: "Sin verificar", tone: "neutral" },
    RECEIVED: { label: "Recibida", tone: "info" },
    IN_REVIEW: { label: "En revisión", tone: "warning" },
    MEETING_SCHEDULED: { label: "Reunión agendada", tone: "info" },
    APPROVED: { label: "Aprobada", tone: "success" },
    REJECTED: { label: "Rechazada", tone: "danger" },
  },
  /** `WineryStatus` · bodegas y `Membership.organizationStatus` (§0, §4). */
  winery: {
    INVITED: { label: "Invitada", tone: "info" },
    ACTIVE: { label: "Activa", tone: "success" },
    SUSPENDED: { label: "Suspendida", tone: "warning" },
    REVOKED: { label: "Revocada", tone: "danger" },
  },
  /** `InvitationStatus` · invitaciones (§2). */
  invitation: {
    PENDING: { label: "Pendiente", tone: "info" },
    ACCEPTED: { label: "Aceptada", tone: "success" },
    EXPIRED: { label: "Caducada", tone: "neutral" },
    REVOKED: { label: "Anulada", tone: "danger" },
  },
  /** `Member.status` · miembros; `INVITED` en la lista de usuarios internos (§5). */
  member: {
    ACTIVE: { label: "Activo", tone: "success" },
    BLOCKED: { label: "Bloqueado", tone: "danger" },
    INVITED: { label: "Invitado", tone: "info" },
  },
  /** Nivel de las alertas del tablero (§8). */
  alert: {
    INFO: { label: "Información", tone: "info" },
    WARNING: { label: "Aviso", tone: "warning" },
    CRITICAL: { label: "Crítica", tone: "danger" },
  },
  /** `TokenizationRequestStatus` · solicitudes de tokenización (Ola 3, §5.1). */
  tokenizationRequest: {
    SUBMITTED: { label: "Enviada", tone: "info" },
    IN_REVIEW: { label: "En revisión", tone: "warning" },
    CHANGES_REQUESTED: { label: "Cambios pedidos", tone: "warning" },
    APPROVED: { label: "Aprobada", tone: "success" },
    REJECTED: { label: "Rechazada", tone: "danger" },
    WITHDRAWN: { label: "Retirada", tone: "neutral" },
  },
} as const satisfies Record<string, Record<string, StatusDefinition>>;

export type StatusKind = keyof typeof statusBadgeMap;
export type StatusOf<K extends StatusKind> = keyof (typeof statusBadgeMap)[K] & string;

/**
 * Etiqueta y tono de un estado. Un estado desconocido (el backend añade uno nuevo) se muestra
 * tal cual en tono neutro en lugar de fallar.
 */
export function getStatusBadge<K extends StatusKind>(
  kind: K,
  status: StatusOf<K> | (string & {}),
): StatusDefinition {
  const map = statusBadgeMap[kind] as Record<string, StatusDefinition>;
  return map[status] ?? { label: status, tone: "neutral" };
}

export interface StatusBadgeProps<K extends StatusKind = StatusKind> extends Omit<
  BadgeProps,
  "tone" | "children"
> {
  kind: K;
  status: StatusOf<K> | (string & {});
  /** Sustituye la etiqueta por defecto (p. ej. "Bloqueado por la plataforma"). */
  label?: string;
}

/**
 * Badge de estado de solicitudes de alta, bodegas, invitaciones, miembros, alertas y solicitudes
 * de tokenización (`kind="tokenizationRequest"`, el `RequestStatusBadge` del contrato de la Ola 3).
 */
export function StatusBadge<K extends StatusKind>({
  kind,
  status,
  label,
  ...props
}: StatusBadgeProps<K>) {
  const definition = getStatusBadge(kind, status);
  return (
    <Badge tone={definition.tone} data-status={status} {...props}>
      {label ?? definition.label}
    </Badge>
  );
}
