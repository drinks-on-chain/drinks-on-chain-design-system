import axe, { type Result, type RunOptions } from "axe-core";

// Comprobación de accesibilidad con axe-core sobre jsdom. jsdom no calcula el diseño ni los
// colores, así que el contraste queda fuera (lo cubre el addon a11y de Storybook); el resto de
// reglas (nombres accesibles, roles, aria-*, regiones vivas, foco oculto) sí se evalúan.
const defaultOptions: RunOptions = {
  rules: {
    "color-contrast": { enabled: false },
    // Los componentes se montan sueltos, sin la página que los contiene.
    region: { enabled: false },
  },
};

function describeViolation(violation: Result): string {
  const nodes = violation.nodes.map((node) => `    ${node.html}`).join("\n");
  return `${violation.id} (${violation.impact ?? "sin impacto"}): ${violation.help}\n${nodes}`;
}

/** Ejecuta axe sobre `container` (por defecto, `document.body`) y devuelve las violaciones. */
export async function getAxeViolations(
  container: Element = document.body,
  options: RunOptions = {},
): Promise<Result[]> {
  const results = await axe.run(container, {
    ...defaultOptions,
    ...options,
    rules: { ...defaultOptions.rules, ...options.rules },
  });
  return results.violations;
}

/** Falla con la lista de violaciones de axe si hay alguna. */
export async function expectNoAxeViolations(
  container: Element = document.body,
  options: RunOptions = {},
): Promise<void> {
  const violations = await getAxeViolations(container, options);
  if (violations.length > 0) {
    throw new Error(
      `axe encontró ${violations.length} violación(es):\n${violations.map(describeViolation).join("\n")}`,
    );
  }
}
