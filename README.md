# @drinks-on-chain/ui

Sistema de diseño de **Drinks on Chain**: tokens, dos temas (Oro Líquido y Cava Reserva), componentes base accesibles y los shells del ERP, el Marketplace, el Backoffice y el POS. React 19 + Tailwind CSS 4, primitivas de [Radix UI](https://www.radix-ui.com/).

Referencia visual y especificación: `docs/05-sistema-de-diseno.md` y `docs/design-system/` en [drinks-on-chain-docsfront](https://github.com/drinks-on-chain/drinks-on-chain-docsfront). Storybook reproduce las cinco maquetas (`Maquetas/*`).

## Instalación

El paquete no se publica en un registro: cada versión es un tarball adjunto a una [GitHub Release](https://github.com/drinks-on-chain/drinks-on-chain-design-system/releases). En la app:

```jsonc
// package.json
"dependencies": {
  "@drinks-on-chain/ui": "https://github.com/drinks-on-chain/drinks-on-chain-design-system/releases/download/v0.1.0/drinks-on-chain-ui-0.1.0.tgz"
}
```

Dependencias que pone la app (peer): `react` y `react-dom` 19, `tailwindcss` 4.1+ (con `@tailwindcss/postcss` o `@tailwindcss/vite`). Radix, lucide-react, cva, clsx, tailwind-merge y qrcode vienen con el paquete. No hace falta `transpilePackages` en Next.js: el paquete es ESM ya compilado.

## Estilos

En el CSS global de la app, exactamente en este orden:

```css
@import "tailwindcss";
@import "@drinks-on-chain/ui/styles.css";
```

`styles.css` incluye:

| Archivo                | Contenido                                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `fonts.css`            | Cormorant Garamond, EB Garamond e Inter **autoalojadas** (woff2 variables, latin + latin-ext)                                     |
| `tokens.css`           | Custom properties `--doc-*`: primitivos, semánticos de `[data-theme="oro"]` (por defecto) y `[data-theme="cava"]`, reduced-motion |
| `theme.css`            | `@theme inline` de Tailwind 4 que expone los tokens como utilidades, `@utility z-*` y estilos base                                |
| `@source "../**/*.js"` | Para que el Tailwind de la app genere las clases que usan los componentes compilados                                              |

Se pueden importar por separado (`@drinks-on-chain/ui/tokens.css`, `/theme.css`, `/fonts.css`), p. ej. para cargar las fuentes de otra forma; en ese caso añade tú el `@source` apuntando a `node_modules/@drinks-on-chain/ui/dist`.

Utilidades disponibles (la paleta por defecto de Tailwind se sustituye por la de la marca):

- Color: `bg-bg`, `bg-bg-raised`, `bg-bg-sunken`, `bg-bg-deep`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-border`, `border-border-strong`, `bg-rule`, `bg-accent`, `text-accent-fg`, `text-accent-text`, `bg-accent-soft`, `success` / `danger` / `warning` / `info` (+ `-soft`), `text-on-status`, `outline-focus`, `bg-overlay`; primitivos (`paper-0…3`, `ink-0…3`, `gold-300/500/700`, `cava-0…3`, `cream-0…2`, `green/red/amber/blue-300/600`) solo para casos justificados.
- Tipografía: `font-display`, `font-text`, `font-ui`, `font-mono`; `text-2xs` (11) … `text-7xl` (96); `tracking-label`, `tracking-caps`, `tracking-wordmark`, `tracking-display`, `tracking-eyebrow`; `leading-editorial`.
- Forma y capas: `rounded-sm` (2), `rounded-md` (4), `rounded-lg` (8); `shadow-overlay`, `shadow-paper-halo`; `z-sticky`, `z-dropdown`, `z-overlay`, `z-modal`, `z-toast`; `ease-out`, `ease-in-out`.
- Breakpoints: `sm` 375, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1440.
- Medidas de layout como variables: `w-(--doc-sidebar-w)`, `h-(--doc-topbar-h)`, `max-w-(--doc-content-max)`…

## Temas

El tema se fija con `data-theme` en `<html>` o en cualquier contenedor:

```tsx
// app/layout.tsx (Next.js): tema fijo, sin JavaScript
<html lang="es" data-theme="oro">  {/* el POS usa "cava" */}
```

Para cambiarlo en tiempo de ejecución, `ThemeProvider` (escribe `data-theme` en `<html>`) y `useTheme()`:

```tsx
<ThemeProvider defaultTheme="oro">{children}</ThemeProvider>
<ThemeProvider scope="element" theme="cava">…</ThemeProvider> {/* solo esta zona */}
```

## Componentes

```tsx
import { Button, Field, Input, DataTable, Modal, toast, cn } from "@drinks-on-chain/ui";
```

- **Utilidades**: `cn()` (clsx + tailwind-merge configurado con la escala propia), `focusRing`, `isNavItemActive`. En Server Components importa `cn` desde `@drinks-on-chain/ui/utils`, que no pasa por ningún módulo cliente.
- **Acciones**: `Button` (primary / secondary / tertiary / destructive / success; sm, md, lg, xl 56 px, kiosk 72 px; `loading`, `iconStart`, `iconEnd`, `asChild`), `IconButton` (`label` obligatorio), `TextLink`.
- **Formularios**: `Field` (etiqueta, `help`, `error`, `required`; conecta `id`, `aria-describedby`, `aria-invalid` y `required` con el control), `Input` (`prefix`, `suffix`, `numeric`, `giant`), `Textarea`, `Select` (+ `SelectItem`, `SelectGroup`, `SelectSeparator`), `Checkbox`, `RadioGroup` (+ `RadioGroupItem`, variante `card`), `Switch`, `FormSection`. Para controles propios: `useFieldControl()`.
- **Estado y datos**: `Badge` (tonos neutral / accent / success / danger / warning / info; soft / strong; punto), `Tag`, `Pill` + `PillGroup`, `Avatar`, `Card` + `CardHeader`, `Divider`, `KeyValueList`, `StatCard`, `DataTable`, `Timeline`, `Countdown`, `QRCode`, `Wordmark`.
- **Feedback**: `Alert`, `Toast` + `Toaster` + `toast()`, `Skeleton` + `SkeletonText`, `Spinner`, `Progress`, `EmptyState`, `ErrorState` (`onRetry`).
- **Navegación**: `Tabs` (+ `TabsList`, `TabsTrigger`, `TabsContent`), `Breadcrumbs`, `Pagination` (`total`, `limit`, `offset`, `onOffsetChange`), `Stepper`.
- **Overlays**: `Modal` (+ `ModalClose`), `SlideOver`, `BottomSheet`, `Popover` (+ `PopoverClose`), `Menu`, `Tooltip`.
- **Shells**: `AppShell` (ERP), `AdminShell` (Backoffice), `StoreShell` (Marketplace), `KioskShell` (POS), `AuthLayout` (`split`, `centered`, `veiled`, `pin`), `PageShell` (editorial).

Convenciones:

- Textos por defecto en español ("Cargando…", "Reintentar", "Cerrar", "Página siguiente"…) y siempre sobrescribibles por props (`closeLabel`, `retryLabel`, `labels={{…}}`).
- Todos los componentes aceptan `className` (se fusiona con `cn`) y reenvían el resto de props al elemento raíz. `ref` es una prop normal (React 19).
- Los componentes interactivos llevan `"use client"` en su propio módulo; los estáticos (`Badge`, `Card`, `StatCard`, `Breadcrumbs`, `AuthLayout`, `PageShell`…) funcionan en Server Components.
- `DataTable<T>` tipa sus columnas (`DataTableColumn<T>`: `accessor`, `cell`, `sortable`, `numeric`, `hideBelow`…); ordena en cliente o, con `manualSorting`, delega el orden en la API. La cabecera pegajosa se pega bajo la barra de los shells (`--doc-sticky-offset`) o dentro del contenedor si se pasa `maxHeight`.
- `Toaster` se monta una vez en la raíz; `toast({ title, description, tone, action })` desde cualquier parte.

### Enlaces y shells en Next.js

Los shells, `Breadcrumbs` y `Menu` renderizan los enlaces con la prop `linkComponent` (por defecto `<a>`). Tipos:

```ts
interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  exact?: boolean;
  badge?: ReactNode;
}
interface NavGroup {
  label?: string;
  items: NavItem[];
}
type LinkComponent = ComponentType<LinkComponentProps> | "a"; // compatible con next/link
```

El elemento activo sale de `item.active` o de comparar `item.href` con `currentPath` (coincidencia exacta o por prefijo de segmento; `exact` para forzar la exacta). Como `next/link` y `usePathname()` son de cliente, el shell se envuelve en un componente cliente propio de la app (una función no puede pasar de un Server Component a un Client Component):

```tsx
// app/(erp)/erp-shell.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppShell, Button } from "@drinks-on-chain/ui";

export function ErpShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      linkComponent={Link}
      currentPath={usePathname()}
      navigation={[{ items: [{ label: "Panel", href: "/" }] }]}
      user={{ name: "Lucía Rojas", role: "Enóloga" }}
      breadcrumbs={[{ label: "Panel" }]}
      topbarActions={<Button>Registrar ingreso</Button>}
    >
      {children}
    </AppShell>
  );
}
```

```tsx
// app/(erp)/layout.tsx (Server Component)
export default function Layout({ children }) {
  return <ErpShell>{children}</ErpShell>;
}
```

Con `typedRoutes` activado en Next, `href` es `string` en el paquete: envuelve `Link` si el compilador lo pide.

## Desarrollo

Requisitos: Node 22 (`.nvmrc`) y pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm dev               # Storybook en http://localhost:6006
pnpm lint              # ESLint + Prettier
pnpm typecheck         # tsc --noEmit
pnpm test              # Vitest + Testing Library (jsdom)
pnpm build             # dist/: JS ESM por módulo, .d.ts, estilos y fuentes
pnpm build-storybook   # storybook-static/ (Vercel: ver vercel.json)
```

Probar cambios en una app sin publicar:

```bash
# en este repo
pnpm build            # o deja corriendo: pnpm exec tsup --watch
pnpm link --global
# en la app
pnpm link --global @drinks-on-chain/ui
```

Alternativa más fiel al resultado publicado: `pnpm pack` aquí e instalar el `.tgz` en la app con `pnpm add ../ruta/drinks-on-chain-ui-X.Y.Z.tgz`.

Las fuentes se regeneran con `node scripts/sync-fonts.mjs` (copia desde `@fontsource-variable/*` a `src/fonts` y reescribe `src/styles/fonts.css`).

## Publicar una versión

1. En `dev`: sube `version` en `package.json` (semver) y añade la entrada en `CHANGELOG.md` (`## [X.Y.Z] · AAAA-MM-DD`).
2. PR `dev → main` y merge.
3. Etiqueta el commit de `main` y empújala:
   ```bash
   git checkout main && git pull
   git tag vX.Y.Z && git push origin vX.Y.Z
   ```
4. El workflow `release.yml` comprueba que la etiqueta coincide con `package.json`, pasa lint, tipos, pruebas y build, ejecuta `pnpm pack` y crea la GitHub Release con `drinks-on-chain-ui-X.Y.Z.tgz` y las notas del CHANGELOG.
5. En cada app, actualiza la URL del tarball con un PR.

## Licencia

Pendiente de decisión. Las tipografías incluidas se distribuyen bajo SIL Open Font License 1.1 (`dist/fonts/*-LICENSE.txt`).
