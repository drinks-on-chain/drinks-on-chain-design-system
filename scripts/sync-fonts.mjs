// Copia las tipografías autoalojadas (latin + latin-ext) desde @fontsource-variable
// a src/fonts y regenera src/styles/fonts.css. Se ejecuta a mano al actualizar fontsource:
//   node scripts/sync-fonts.mjs
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontsDir = join(root, "src", "fonts");
mkdirSync(fontsDir, { recursive: true });

const families = [
  { pkg: "cormorant-garamond", css: ["wght.css", "wght-italic.css"] },
  { pkg: "eb-garamond", css: ["wght.css", "wght-italic.css"] },
  { pkg: "inter", css: ["wght.css"] },
];

const blocks = [];
for (const { pkg, css } of families) {
  const base = join(root, "node_modules", "@fontsource-variable", pkg);
  copyFileSync(join(base, "LICENSE"), join(fontsDir, `${pkg}-LICENSE.txt`));
  for (const file of css) {
    const source = readFileSync(join(base, file), "utf8");
    const faces = source.split(/(?=\/\* )/);
    for (const face of faces) {
      const match = face.match(/^\/\* (.+?) \*\//);
      if (!match) continue;
      const name = match[1];
      if (!/-latin(-ext)?-wght-(normal|italic)$/.test(name)) continue;
      const fileName = `${name}.woff2`;
      copyFileSync(join(base, "files", fileName), join(fontsDir, fileName));
      blocks.push(face.trim().replace(/url\(\.\/files\/([^)]+)\)/, 'url("../fonts/$1")'));
    }
  }
}

const header = `/* Tipografías autoalojadas (decisión 4.4): Cormorant Garamond, EB Garamond e Inter.
   Subconjuntos latin y latin-ext, variables. Generado por scripts/sync-fonts.mjs; no editar a mano.
   Licencia SIL OFL 1.1 (ver ../fonts/*-LICENSE.txt). */\n\n`;
writeFileSync(join(root, "src", "styles", "fonts.css"), header + blocks.join("\n\n") + "\n");
console.log(`fonts.css: ${blocks.length} @font-face`);
