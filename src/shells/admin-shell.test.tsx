import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OrganizationSwitcher } from "../components/organization-switcher";
import { AdminShell } from "./admin-shell";

const navigation = [
  { items: [{ label: "Tablero", href: "/" }] },
  { label: "Red", items: [{ label: "Bodegas", href: "/bodegas" }] },
];

function renderShell(props: Partial<Parameters<typeof AdminShell>[0]> = {}) {
  const onSelect = vi.fn();
  render(
    <AdminShell
      navigation={navigation}
      currentPath="/bodegas"
      user={{ name: "Ana Gutiérrez", role: "Gestora · ADMIN" }}
      userMenu={[{ label: "Cerrar sesión", onSelect: () => {} }]}
      search={{ placeholder: "Buscar bodega, usuario…" }}
      commandPalette={{
        groups: [{ heading: "Ir a", items: [{ id: "wineries", label: "Bodegas", onSelect }] }],
      }}
      organizationSwitcher={
        <OrganizationSwitcher
          organizations={[
            { id: "platform", name: "Drinks on Chain", description: "Plataforma · ADMIN" },
            { id: "w1", name: "Destilería Cinti Viejo", description: "Bodega · OWNER" },
          ]}
          activeId="platform"
          onChange={() => {}}
        />
      }
      {...props}
    >
      {props.children ?? <h1>Bodegas</h1>}
    </AdminShell>,
  );
  return { onSelect };
}

describe("AdminShell", () => {
  it("el buscador de la barra superior abre la paleta integrada", async () => {
    const { onSelect } = renderShell();
    const trigger = screen.getByRole("button", { name: /Buscar bodega, usuario…/ });
    expect(trigger).toHaveAttribute("aria-keyshortcuts", "Meta+K Control+K /");
    await userEvent.click(trigger);
    expect(await screen.findByRole("dialog", { name: "Buscador global" })).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("⌘K / Ctrl+K y `/` abren la paleta; `/` no se captura dentro de un campo", async () => {
    renderShell({ children: <input aria-label="Nota" /> });
    await userEvent.keyboard("{Control>}k{/Control}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await userEvent.keyboard("/");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    const note = screen.getByLabelText("Nota");
    await userEvent.click(note);
    await userEvent.keyboard("/");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sin paleta integrada llama a search.onOpen (compatible con 0.2)", async () => {
    const onOpen = vi.fn();
    renderShell({ commandPalette: undefined, search: { onOpen } });
    await userEvent.keyboard("{Meta>}k{/Meta}");
    expect(onOpen).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: /Buscar…/ }));
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it("selector de organización en la cabecera y menú de usuario en la barra lateral", async () => {
    renderShell();
    const banner = screen.getByRole("banner");
    expect(banner).toContainElement(
      screen.getByRole("button", { name: "Organización activa: Drinks on Chain" }),
    );
    expect(
      screen.getAllByRole("button", { name: "Menú de usuario: Ana Gutiérrez" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Bodegas" })[0]).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
