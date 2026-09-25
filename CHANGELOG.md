# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); el proyecto sigue [versionado semántico](https://semver.org/lang/es/).

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
