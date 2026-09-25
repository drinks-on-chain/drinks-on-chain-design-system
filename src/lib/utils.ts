import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge conoce la escala propia (text-2xs, text-md, shadow-overlay…)
// para resolver bien los conflictos entre clases del paquete y de la app.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "bg",
        "bg-raised",
        "bg-sunken",
        "bg-deep",
        "fg",
        "fg-muted",
        "fg-subtle",
        "border",
        "border-strong",
        "rule",
        "accent",
        "accent-fg",
        "accent-text",
        "accent-soft",
        "success",
        "success-soft",
        "danger",
        "danger-soft",
        "warning",
        "warning-soft",
        "info",
        "info-soft",
        "on-status",
        "focus",
        "overlay",
      ],
      font: ["display", "text", "ui", "mono"],
      text: ["2xs", "xs", "sm", "md", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"],
      radius: ["sm", "md", "lg"],
      shadow: ["overlay", "paper-halo"],
      tracking: ["label", "caps", "wordmark", "display", "eyebrow"],
      leading: ["tight", "normal", "editorial"],
    },
  },
});

/** Une clases condicionales y resuelve conflictos de Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
