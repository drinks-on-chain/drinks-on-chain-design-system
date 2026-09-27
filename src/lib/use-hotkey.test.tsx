import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { formatHotkey, matchesHotkey, useHotkey, type UseHotkeyOptions } from "./use-hotkey";

function Probe({
  hotkey,
  handler,
  options,
}: {
  hotkey: string | string[];
  handler: () => void;
  options?: UseHotkeyOptions;
}) {
  useHotkey(hotkey, handler, options);
  return <input aria-label="Campo" />;
}

const key = (init: Partial<KeyboardEvent>) =>
  ({
    key: "",
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    ...init,
  }) as KeyboardEvent;

describe("matchesHotkey", () => {
  it("mod acepta ⌘ y Ctrl", () => {
    expect(matchesHotkey(key({ key: "k", metaKey: true }), "mod+k")).toBe(true);
    expect(matchesHotkey(key({ key: "K", ctrlKey: true }), "mod+k")).toBe(true);
    expect(matchesHotkey(key({ key: "k" }), "mod+k")).toBe(false);
    expect(matchesHotkey(key({ key: "k", ctrlKey: true, altKey: true }), "mod+k")).toBe(false);
  });

  it("teclas con nombre, alias y símbolos con Mayús", () => {
    expect(matchesHotkey(key({ key: "Escape" }), "esc")).toBe(true);
    expect(matchesHotkey(key({ key: "/" }), "/")).toBe(true);
    expect(matchesHotkey(key({ key: "?", shiftKey: true }), "?")).toBe(true);
    expect(matchesHotkey(key({ key: "p", shiftKey: true }), "p")).toBe(false);
    expect(matchesHotkey(key({ key: "p", shiftKey: true, ctrlKey: true }), "ctrl+shift+p")).toBe(
      true,
    );
  });
});

describe("formatHotkey", () => {
  it("usa símbolos en macOS y nombres en el resto", () => {
    expect(formatHotkey("mod+k", true)).toBe("⌘K");
    expect(formatHotkey("mod+k", false)).toBe("Ctrl K");
    expect(formatHotkey("shift+mod+p", true)).toBe("⇧⌘P");
    expect(formatHotkey("escape", false)).toBe("Esc");
  });
});

describe("useHotkey", () => {
  it("dispara el manejador con el atajo", async () => {
    const handler = vi.fn();
    render(<Probe hotkey="mod+k" handler={handler} />);
    await userEvent.keyboard("{Control>}k{/Control}");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("`/` no se dispara mientras se escribe en un campo, ⌘K sí", async () => {
    const handler = vi.fn();
    render(<Probe hotkey={["/", "mod+k"]} handler={handler} />);
    await userEvent.click(screen.getByRole("textbox", { name: "Campo" }));
    await userEvent.keyboard("/");
    expect(handler).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveValue("/");
    await userEvent.keyboard("{Meta>}k{/Meta}");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("`/` fuera de un campo se dispara y evita escribirlo", async () => {
    const handler = vi.fn();
    render(<Probe hotkey="/" handler={handler} />);
    await userEvent.keyboard("/");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("enabled={false} lo desactiva", async () => {
    const handler = vi.fn();
    render(<Probe hotkey="mod+k" handler={handler} options={{ enabled: false }} />);
    await userEvent.keyboard("{Control>}k{/Control}");
    expect(handler).not.toHaveBeenCalled();
  });
});
