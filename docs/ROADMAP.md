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
- [x] PR `dev → main` y etiqueta `v0.1.0` (Release con tarball; luego 0.1.1 y 0.1.2) · 25-09-2026
- [x] Proyecto de Vercel para Storybook: <https://drinks-on-chain-storybook.vercel.app> · 27-09-2026

## 0.2.0 · oro tostado, contraste AA y componentes editoriales de acceso

- [x] Tokens de texto de estado, oro tostado en el tema Oro, `headingLevel` en estados vacíos y de error, foco devuelto en overlays controlados · 25-09-2026
- [x] `BrandSeal`, `VineOrnament`, `GlassBottleOrnament`, `VineyardScene` para las pantallas de acceso · 25-09-2026
- [x] PR #4 `dev → main` y etiqueta `v0.2.0`: Release con `drinks-on-chain-ui-0.2.0.tgz` · 27-09-2026
- [x] `release.yml` publica las etiquetas con guion (`vX.Y.Z-rc.N`, sobre `dev`) como pre-release · 27-09-2026
- [ ] Plantilla y ERP a `ui` 0.2.x (O0-PK-1; pistas de la plantilla y del ERP)

## 0.3.0 · componentes del Backoffice (Ola 1, O1-PK-1)

- [x] `Combobox` (teclado, asíncrono, vacío / carga / error, simple y múltiple) sobre el Popover de Radix · 27-09-2026
- [x] `CommandPalette` (⌘K / Ctrl+K, grupos, atajos, flechas, Esc, `aria-live`) y `useHotkey` · 27-09-2026
- [x] `DataTable` densa: acciones masivas, filtro por columna, paginación `limit/offset` con tamaño de página, estado de error; `BulkActionBar` · 27-09-2026
- [x] `FilterBar`, `DateRangePicker` (sin dependencias) y `StatusBadge` con los estados del contrato O1 · 27-09-2026
- [x] `ReasonDialog` (motivo 3–500) y `ConfirmDialog` (destructiva, confirmación escrita) · 27-09-2026
- [x] `OtpInput`, `CopyField` y `SecretReveal` para el segundo factor (TOTP y códigos de recuperación) · 27-09-2026
- [x] `KpiCard`, `AlertsFeed`, `RoleMatrix` y `OrganizationSwitcher` · 27-09-2026
- [x] `AdminShell` según la maqueta 03: paleta integrada, selector de organización, menú de usuario, Inter 14 px · 27-09-2026
- [x] Historias (Oro / Cava, compacta) y pruebas Vitest de cada componente; CHANGELOG 0.3.0 · 27-09-2026
- [ ] Integración en `dev` con CI verde y pre-release `v0.3.0-rc.1` (tarball verificado)
- [ ] PR `dev → main` y etiqueta `v0.3.0` (coordinación)

## Siguiente

- [ ] CameraScanner compartido por Marketplace y POS
- [ ] Componentes editoriales de 05 §3.2 (SmallHeading, Prose, InkPhoto, AgeGate…) al migrar las landings
- [ ] Pruebas visuales por componente en los dos temas (Chromatic u otra herramienta) y Lighthouse ≥ 95
- [ ] Decidir licencia del paquete
