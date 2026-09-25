// Tras tsup + tsc: añade extensiones a las importaciones relativas (ESM estricto),
// copia estilos y fuentes a dist y comprueba que las directivas "use client" sobreviven.
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const dist = join(root, "dist");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const specifier = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])(\.{1,2}\/[^"']*)\2/g;

function fixSpecifiers(file, ext) {
  const code = readFileSync(file, "utf8");
  const fixed = code.replace(specifier, (match, lead, quote, spec) => {
    if (/\.(js|css|json)$/.test(spec)) return match;
    const base = resolve(dirname(file), spec);
    if (existsSync(base + ext)) return `${lead}${quote}${spec}.js${quote}`;
    if (existsSync(join(base, "index" + ext))) return `${lead}${quote}${spec}/index.js${quote}`;
    throw new Error(`No se resuelve "${spec}" en ${relative(root, file)}`);
  });
  if (fixed !== code) writeFileSync(file, fixed);
}

const files = walk(dist);
for (const file of files) {
  if (file.endsWith(".d.ts")) fixSpecifiers(file, ".d.ts");
  else if (file.endsWith(".js")) fixSpecifiers(file, ".js");
}

// Directivas "use client": cada fuente que la declara debe conservarla en dist.
let clientCount = 0;
for (const file of walk(src)) {
  if (!/\.tsx?$/.test(file) || /\.(stories|test)\.tsx?$/.test(file)) continue;
  if (file.includes(join("src", "test")) || file.includes(join("src", "stories"))) continue;
  const source = readFileSync(file, "utf8");
  if (!/^\s*["']use client["']/.test(source)) continue;
  const out = join(dist, relative(src, file)).replace(/\.tsx?$/, ".js");
  const built = readFileSync(out, "utf8");
  if (!/^\s*["']use client["']/.test(built)) {
    throw new Error(`Falta "use client" en ${relative(root, out)}`);
  }
  clientCount++;
}

cpSync(join(src, "styles"), join(dist, "styles"), { recursive: true });
cpSync(join(src, "fonts"), join(dist, "fonts"), { recursive: true });

console.log(
  `postbuild: ${files.length} archivos, ${clientCount} módulos "use client", estilos y fuentes copiados`,
);
