# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); el proyecto sigue [versionado semántico](https://semver.org/lang/es/).

## [Sin publicar]

### Añadido

- Tokens de texto de estado `--doc-success-text`, `--doc-danger-text`, `--doc-warning-text` e `--doc-info-text` (utilidades `text-success-text`…), con contraste AA sobre su fondo `-soft` y sobre el papel en los dos temas.
- `EmptyState` y `ErrorState`: prop `headingLevel` (2 por defecto; antes siempre h4, que saltaba niveles).

### Cambiado

- Badges suaves, `Alert`, `Countdown`, `StatCard`, errores de `Field` y opciones destructivas de `Menu` usan los tokens de texto de estado (antes el color base: 3,1–4,4:1 sobre sus fondos).
- `--doc-accent-text` del tema Oro pasa de `#8a651a` a `#7a5915` (5,4:1 sobre `accent-soft`).

### Corregido

- `Modal`, `SlideOver` y `BottomSheet` controlados sin `trigger` devuelven el foco al elemento que lo tenía al abrirse (antes quedaba en `<body>`).

## [0.1.2] · 2026-09-25

### Corregido

- `DataTable`: la cabecera pegajosa solo se activa con `maxHeight`. En 0.1.1, sin alto máximo, quedaba desplazada por `--doc-sticky-offset` dentro del contenedor con scroll y tapaba las primeras filas.

## [0.1.1] · 2026-09-25

### Corregido

- `DataTable`: el contenedor siempre tiene scroll horizontal propio; antes, desde `lg`, una tabla ancha desbordaba la página. La cabecera pegajosa se pega dentro del contenedor (usa `maxHeight` en tablas largas).
- `Select`, `Menu`, `Popover` y `Tooltip` usan la nueva capa `z-popover` (`--doc-z-popover: 45`), por encima de los modales: un `Select` dentro de un `Modal` o `SlideOver` ya se puede abrir con el ratón.

## [0.1.0] · 2026-09-25

Primera versión (Etapa 0.1 del roadmap del frontend).

### Añadido

- Tokens `--doc-*` (primitivos y semánticos) con los temas Oro Líquido (`oro`, por defecto) y Cava Reserva (`cava`), `prefers-reduced-motion` y `@theme inline` de Tailwind CSS 4 (color, tipografía, escala, radios, sombras, easing, breakpoints, capas).
- Tipografías autoalojadas: Cormorant Garamond, EB Garamond e Inter (woff2 variables, latin + latin-ext).
- `ThemeProvider` / `useTheme` y la utilidad `cn()` (también en `@drinks-on-chain/ui/utils`).
- Componentes base: Button, IconButton, TextLink, Field, Input (prefijo, sufijo, `numeric`, `giant`), Textarea, Select, Checkbox, RadioGroup, Switch, FormSection, Badge, Tag, Pill, Avatar, Card, Divider, KeyValueList, StatCard, DataTable, Timeline, Countdown, QRCode, Wordmark, Alert, Toast / Toaster / `toast()`, Skeleton, Spinner, Progress, EmptyState, ErrorState, Tabs, Breadcrumbs, Pagination, Stepper, Modal, SlideOver, BottomSheet, Popover, Menu y Tooltip.
- Shells: AppShell, AdminShell, StoreShell, KioskShell, AuthLayout (`split`, `centered`, `veiled`, `pin`) y PageShell, con `linkComponent` para `next/link`.
- Storybook con conmutador de tema, anchos 375 / 768 / 1024 / 1280 / 1440, addon de accesibilidad, una historia por componente y las cinco maquetas (Fundamentos, ERP, Marketplace, Backoffice, POS).
- CI (lint, tipos, pruebas, build, Storybook) y publicación por GitHub Release con el tarball del paquete.
