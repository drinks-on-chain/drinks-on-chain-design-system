import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../test/axe";
import { ExplorerLink, isHttpUrl } from "./explorer-link";

describe("ExplorerLink", () => {
  it("solo enlaza URLs http(s)", () => {
    expect(isHttpUrl("https://explorer.example/tx/1")).toBe(true);
    expect(isHttpUrl("http://localhost:8000/tx/1")).toBe(true);
    expect(isHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isHttpUrl("/tx/1")).toBe(false);
    expect(isHttpUrl(null)).toBe(false);
    const { container } = render(<ExplorerLink href="data:text/html,hola" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("iconOnly conserva el nombre accesible y pasa axe", async () => {
    render(<ExplorerLink href="https://explorer.example/tx/1" iconOnly />);
    expect(
      screen.getByRole("link", { name: "Ver en el explorador (se abre en una pestaña nueva)" }),
    ).toBeInTheDocument();
    await expectNoAxeViolations();
  });
});
