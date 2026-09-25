import { defineConfig } from "tsup";

// Un archivo de salida por archivo fuente (bundle: false) para conservar
// las directivas "use client" de cada componente. Las declaraciones .d.ts
// las genera tsc (tsconfig.build.json) y scripts/postbuild.mjs completa
// las extensiones de las importaciones relativas y copia estilos y fuentes.
export default defineConfig({
  entry: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.stories.tsx",
    "!src/**/*.test.{ts,tsx}",
    "!src/test/**",
    "!src/stories/**",
  ],
  outDir: "dist",
  format: ["esm"],
  target: "es2022",
  platform: "browser",
  bundle: false,
  splitting: false,
  sourcemap: false,
  dts: false,
  clean: true,
  minify: false,
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
