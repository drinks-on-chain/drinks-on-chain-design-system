import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { LinkComponentProps } from "../lib/link";
import { AppShell } from "./app-shell";

// Sustituto de `next/link`: marca los enlaces que pasan por el componente inyectado y, como él,
// evita la navegación del documento.
function RouterLink({ onClick, ...props }: LinkComponentProps) {
  return (
    <a
      data-router-link=""
      {...props}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
      }}
    />
  );
}

const navigation = [
  { items: [{ label: "Tablero", href: "/" }] },
  { label: "Vendimia", items: [{ label: "Pesaje", href: "/vendimia/pesaje" }] },
];

function renderShell() {
  render(
    <AppShell
      navigation={navigation}
      currentPath="/vendimia/pesaje"
      linkComponent={RouterLink}
      brandHref="/"
      user={{ name: "Lucía Rojas", role: "Enóloga · Cinti Viejo" }}
      userMenu={[
        { label: "Mi perfil", href: "/perfil" },
        { type: "separator" },
        { label: "Cerrar sesión", onSelect: () => {} },
      ]}
      breadcrumbs={[{ label: "Vendimia", href: "/vendimia" }, { label: "Pesaje" }]}
    >
      <h1>Pesaje</h1>
    </AppShell>,
  );
}

describe("AppShell", () => {
  it("usa `linkComponent` en la marca, la navegación y las migas", () => {
    renderShell();
    expect(screen.getByRole("link", { name: "Drinks on Chain" })).toHaveAttribute(
      "data-router-link",
    );
    const nav = screen.getByRole("navigation", { name: "Navegación principal" });
    for (const link of within(nav).getAllByRole("link")) {
      expect(link).toHaveAttribute("data-router-link");
    }
    expect(screen.getByRole("link", { name: "Vendimia" })).toHaveAttribute("data-router-link");
  });

  it("los enlaces del menú de usuario usan `linkComponent` (sin recargar la página)", async () => {
    renderShell();
    await userEvent.click(screen.getByRole("button", { name: "Menú de usuario: Lucía Rojas" }));
    const profile = await screen.findByRole("menuitem", { name: "Mi perfil" });
    expect(profile.tagName).toBe("A");
    expect(profile).toHaveAttribute("href", "/perfil");
    expect(profile).toHaveAttribute("data-router-link");
  });

  it("en el cajón móvil, elegir un enlace del menú de usuario cierra el cajón", async () => {
    renderShell();
    await userEvent.click(screen.getByRole("button", { name: "Abrir menú" }));
    const drawer = await screen.findByRole("dialog", { name: "Navegación principal" });
    await userEvent.click(
      within(drawer).getByRole("button", { name: "Menú de usuario: Lucía Rojas" }),
    );
    const profile = await screen.findByRole("menuitem", { name: "Mi perfil" });
    expect(profile).toHaveAttribute("data-router-link");
    await userEvent.click(profile);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
