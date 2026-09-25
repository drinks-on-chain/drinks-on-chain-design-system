# drinks-on-chain-design-system · convenciones

Paquete `@drinks-on-chain/ui` (Etapa 0.1). Especificación: `../docs/05-sistema-de-diseno.md` y maquetas en `../docs/design-system/`. Tareas y avance: `docs/ROADMAP.md` (marca `- [x] … · fecha`).

## Git

- Trabajo en `dev`; nunca commits directos a `main`. PR `dev → main`.
- Conventional Commits: `feat(button): …`, `fix(data-table): …`, `test: …`, `docs: …`, `ci: …`, `chore: …`. Un commit por cambio lógico.
- Publicar = subir versión + CHANGELOG en `dev`, merge a `main`, etiqueta `vX.Y.Z` (el workflow `release.yml` crea la Release con el tarball). No hay registro npm.

## Código

- React 19, TypeScript estricto, Tailwind CSS 4, Radix (`radix-ui`), cva, lucide-react.
- Identificadores en inglés; comentarios, documentación y textos por defecto en español, siempre sobrescribibles por props.
- Un componente por archivo en `src/components` (shells en `src/shells`), con su historia `*.stories.tsx` y, si tiene lógica, su prueba `*.test.tsx`. Exporta todo desde `src/index.ts`.
- `"use client"` solo en módulos que usan estado, efectos, contexto, manejadores o Radix. El índice no lleva la directiva.
- Colores, tipografía y medidas solo con tokens (`bg-bg`, `text-fg-muted`, `border-border`, `text-accent-text`…). El oro es escaso; el rojo solo es peligro. Sin sombras salvo `shadow-overlay` en overlays.
- Foco visible con `focusRing` (2 px, desplazamiento 2 px). Anima solo `transform` y `opacity` y añade `motion-reduce:animate-none` a las animaciones.
- Las clases deben ser literales en el código (Tailwind escanea `dist/**/*.js` desde la app): nada de clases construidas por concatenación.

## Comprobaciones antes de un PR

`pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm build-storybook`.

No dejes servidores de desarrollo abiertos; para revisar Storybook usa `pnpm build-storybook`.
