import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OrganizationSwitcher, type OrganizationOption } from "./organization-switcher";

const organizations: OrganizationOption[] = [
  { id: "platform", name: "Drinks on Chain", description: "Plataforma · ADMIN" },
  { id: "w1", name: "Destilería Cinti Viejo", description: "Bodega · OWNER" },
];

describe("OrganizationSwitcher", () => {
  it("abre con el teclado y marca la organización activa", async () => {
    const onChange = vi.fn();
    render(
      <OrganizationSwitcher
        organizations={organizations}
        activeId="platform"
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Organización activa: Drinks on Chain" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const items = await screen.findAllByRole("menuitemradio");
    expect(items[0]).toHaveAttribute("aria-checked", "true");
    expect(items[1]).toHaveAttribute("aria-checked", "false");
    await userEvent.click(items[1]!);
    expect(onChange).toHaveBeenCalledWith("w1");
  });

  it("con una sola organización muestra el nombre sin menú", () => {
    render(
      <OrganizationSwitcher
        organizations={organizations.slice(0, 1)}
        activeId="platform"
        onChange={() => {}}
      />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Drinks on Chain")).toBeInTheDocument();
  });
});
