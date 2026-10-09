import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getStatusBadge, StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("mapea los estados del contrato a etiqueta y tono", () => {
    expect(getStatusBadge("winery", "SUSPENDED")).toEqual({ label: "Suspendida", tone: "warning" });
    expect(getStatusBadge("application", "APPROVED").tone).toBe("success");
    expect(getStatusBadge("invitation", "EXPIRED").label).toBe("Caducada");
    expect(getStatusBadge("member", "BLOCKED").tone).toBe("danger");
  });

  it("un estado desconocido se muestra tal cual en neutro", () => {
    expect(getStatusBadge("winery", "ARCHIVED")).toEqual({ label: "ARCHIVED", tone: "neutral" });
  });

  it("cubre la solicitud de tokenización de la Ola 3 con sus etiquetas", () => {
    const labels = (
      ["SUBMITTED", "IN_REVIEW", "CHANGES_REQUESTED", "APPROVED", "REJECTED", "WITHDRAWN"] as const
    ).map((status) => getStatusBadge("tokenizationRequest", status).label);
    expect(labels).toEqual([
      "Enviada",
      "En revisión",
      "Cambios pedidos",
      "Aprobada",
      "Rechazada",
      "Retirada",
    ]);
    render(<StatusBadge kind="tokenizationRequest" status="CHANGES_REQUESTED" />);
    expect(screen.getByText("Cambios pedidos")).toHaveAttribute("data-status", "CHANGES_REQUESTED");
  });

  it("renderiza la etiqueta, admite sustituirla y marca el estado", () => {
    const { rerender } = render(<StatusBadge kind="application" status="IN_REVIEW" />);
    expect(screen.getByText("En revisión")).toHaveAttribute("data-status", "IN_REVIEW");
    rerender(<StatusBadge kind="member" status="BLOCKED" label="Bloqueado por la plataforma" />);
    expect(screen.getByText("Bloqueado por la plataforma")).toBeInTheDocument();
  });
});
