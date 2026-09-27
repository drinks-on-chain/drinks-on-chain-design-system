import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiCard } from "./kpi-card";

describe("KpiCard", () => {
  it("muestra la cifra, el desglose y el enlace a la lista", () => {
    render(
      <KpiCard
        label="Solicitudes abiertas"
        value="7"
        breakdown={[
          { label: "Recibidas", value: 4 },
          { label: "En revisión", value: 2 },
        ]}
        href="/solicitudes"
        linkLabel="Ver bandeja"
      />,
    );
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Recibidas").nextSibling).toHaveTextContent("4");
    expect(screen.getByRole("link", { name: "Ver bandeja" })).toHaveAttribute(
      "href",
      "/solicitudes",
    );
  });

  it("en carga oculta la cifra y la variación y lo anuncia", () => {
    const { container } = render(
      <KpiCard label="Bodegas activas" value="12" delta="+2 esta semana" loading />,
    );
    expect(screen.queryByText("12")).not.toBeInTheDocument();
    expect(screen.queryByText("+2 esta semana")).not.toBeInTheDocument();
    expect(screen.getByText("Cargando…")).toHaveClass("sr-only");
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });
});
