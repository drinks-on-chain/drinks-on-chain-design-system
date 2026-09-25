import type { Decorator, Preview } from "@storybook/react-vite";
import "./preview.css";

// Tema desde la barra de herramientas: se aplica a <html> y al contenedor de cada historia.
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string | undefined) ?? "oro";
  if (typeof document !== "undefined") document.documentElement.dataset.theme = theme;
  const fullscreen = context.parameters.layout === "fullscreen";
  return (
    <div
      data-theme={theme}
      className={fullscreen ? "min-h-dvh bg-bg font-ui text-fg" : "bg-bg p-6 font-ui text-fg"}
    >
      <Story />
    </div>
  );
};

const viewport = (
  name: string,
  width: number,
  height: number,
  type: "mobile" | "tablet" | "desktop",
) => ({
  name,
  styles: { width: `${width}px`, height: `${height}px` },
  type,
});

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Tema del sistema de diseño",
      toolbar: {
        title: "Tema",
        icon: "paintbrush",
        items: [
          { value: "oro", title: "Oro Líquido (claro)" },
          { value: "cava", title: "Cava Reserva (oscuro)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "oro" },
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    viewport: {
      options: {
        sm375: viewport("Móvil · 375", 375, 812, "mobile"),
        md768: viewport("Tablet · 768", 768, 1024, "tablet"),
        lg1024: viewport("Tablet apaisada / POS · 1024", 1024, 768, "tablet"),
        xl1280: viewport("Escritorio · 1280", 1280, 800, "desktop"),
        xxl1440: viewport("Escritorio ancho · 1440", 1440, 900, "desktop"),
      },
    },
    a11y: { test: "todo" },
    options: {
      storySort: {
        order: ["Introducción", "Maquetas", "Fundamentos", "Componentes", "Shells"],
      },
    },
  },
};

export default preview;
