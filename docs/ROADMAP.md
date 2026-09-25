# Roadmap · drinks-on-chain-design-system

Detalle de la Etapa 0.1 de `docs/03-roadmap-frontend.md` («las cinco maquetas de `design-system/` se reproducen con componentes del paquete»).

## 0.1.0 · tokens, componentes base y shells

- [x] Andamiaje: pnpm 10, Node 22, TypeScript estricto, tsup (ESM por módulo con `"use client"` conservado), `files` del paquete · 25-09-2026
- [x] Tokens `--doc-*` y temas `oro` / `cava` desde `design-system/tokens.css` · 25-09-2026
- [x] `@theme inline` de Tailwind 4 y `@source` para el Tailwind de la app · 25-09-2026
- [x] Tipografías autoalojadas (Cormorant Garamond, EB Garamond, Inter) · 25-09-2026
- [x] `ThemeProvider`, `useTheme` y `cn()` · 25-09-2026
- [x] Acciones: Button, IconButton, TextLink, Spinner · 25-09-2026
- [x] Formularios: Field, Input, Textarea, Select, Checkbox, RadioGroup, Switch, FormSection · 25-09-2026
- [x] Estado y datos: Badge, Tag, Pill, Avatar, Card, Divider, KeyValueList, StatCard, Timeline, Countdown, QRCode, Wordmark · 25-09-2026
- [x] Feedback: Alert, Toast / Toaster, Skeleton, Progress, EmptyState, ErrorState · 25-09-2026
- [x] Navegación: Tabs, Breadcrumbs, Pagination (limit/offset), Stepper · 25-09-2026
- [x] Overlays: Modal, SlideOver, BottomSheet, Popover, Menu, Tooltip · 25-09-2026
- [x] DataTable tipada (orden, densidad, selección, acciones por fila, cabecera pegajosa, vacío y carga) · 25-09-2026
- [x] Shells: AppShell, AdminShell, StoreShell, KioskShell, AuthLayout, PageShell con `linkComponent` · 25-09-2026
- [x] Storybook: temas, anchos 375–1440, addon a11y, historia por componente · 25-09-2026
- [x] Maquetas en Storybook: Fundamentos, ERP, Marketplace, Backoffice, POS · 25-09-2026
- [x] Calidad: ESLint + Prettier, `tsc --noEmit`, Vitest (Button, Field, Modal, DataTable, Pagination, Countdown) · 25-09-2026
- [x] CI (`ci.yml`) y publicación por GitHub Release (`release.yml`) · 25-09-2026
- [x] Verificado: el tarball instalado en una app Next.js 16 + Tailwind 4 genera las clases y sirve las fuentes · 25-09-2026
- [x] Documentación: README, CHANGELOG, CLAUDE.md · 25-09-2026
- [ ] PR `dev → main` y etiqueta `v0.1.0` (la hace el equipo tras revisar)
- [ ] Proyecto de Vercel para Storybook (`vercel.json` listo; lo crea el equipo)

## Siguiente (0.2 y posteriores)

- [ ] Combobox y CommandPalette (buscador global ⌘K del Backoffice)
- [ ] CameraScanner compartido por Marketplace y POS
- [ ] Componentes editoriales de 05 §3.2 (SmallHeading, Prose, InkPhoto, AgeGate…) al migrar las landings
- [ ] Pruebas visuales por componente en los dos temas (Chromatic u otra herramienta) y Lighthouse ≥ 95
- [ ] Decidir licencia del paquete
