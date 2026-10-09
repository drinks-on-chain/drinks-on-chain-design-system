# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); el proyecto sigue [versionado semántico](https://semver.org/lang/es/).

## [0.4.0] · sin publicar

Componentes de la cadena para la Ola 3 (O3-PK-1; contrato `o3-tokenizacion` §0, §2.3, §2.4 y §5.1). Sin rupturas respecto a 0.3.1. Pre-release: `v0.4.0-rc.1` (2026-10-08).

### Añadido

- `TxStatusBadge`: estado de una transacción en la red con las etiquetas del contrato (`PENDING` «En cola», `BUILDING` «Preparando», `SUBMITTED` «Enviada a la red», `CONFIRMED` «Confirmada», `RETRYING` «Reintentando», `FAILED` «Fallida»). El estado se lee por icono y texto además del tono; el indicador de «en curso» anima solo `transform` u `opacity` y se detiene con `prefers-reduced-motion`. Con `explorerUrl` añade «Ver en el explorador»; `lastError` (`{ code, message, retryable }`) se muestra como texto visible con su código, no en un tooltip; `attempts` aparece a partir del segundo intento. Los cambios de estado se anuncian una vez en una región `aria-live="polite"` (el montaje no se anuncia; `announce={false}` la quita en listas largas). Declara sus propios tipos (`TxStatus`, `TxStatusError`), estructuralmente compatibles con `ChainTxRef`; un estado desconocido se muestra en neutro. Utilidades `getTxStatus` e `isTxInProgress` (para el `refetchInterval` de las apps).
- `ChainAddress`: dirección StrKey de 56 caracteres (`G…` / `C…`) o hash de 64 en hex, en monoespaciada y truncada por el medio (`GDN3CA…4SB6`; `head`, `tail`, `truncate`). La dirección completa la leen los lectores de pantalla y es la que llega al portapapeles, con el botón (patrón de `CopyField`: `useCopy` y aviso «Copiado» con `aria-live`) y al seleccionar el texto y copiar. `explorerUrl` opcional (enlace de icono con nombre accesible). Utilidades `truncateMiddle` y `getChainAddressKind`.
- `ExplorerLink`: enlace externo al explorador (`target="_blank"`, `rel="noopener noreferrer"`, aviso «se abre en una pestaña nueva» para lectores de pantalla, `iconOnly`). Recibe la URL completa que devuelve el backend (las apps nunca escriben el host) y solo enlaza `http(s)` (`isHttpUrl`).
- `StatusBadge`: tipo `tokenizationRequest` con los estados de la solicitud de tokenización (`SUBMITTED` «Enviada», `IN_REVIEW` «En revisión», `CHANGES_REQUESTED` «Cambios pedidos», `APPROVED` «Aprobada», `REJECTED` «Rechazada», `WITHDRAWN` «Retirada»). Es el `RequestStatusBadge` del contrato: `<StatusBadge kind="tokenizationRequest" status={…} />`.
- Pruebas de accesibilidad con `axe-core` en Vitest (`src/test/axe.ts`: `expectNoAxeViolations`) para los componentes nuevos; el contraste lo sigue comprobando el addon a11y de Storybook.

### Conocido

- `Select` abierto: axe en el navegador da `aria-hidden-focus`. Mientras está abierto, el Select de Radix marca el resto de la página con `aria-hidden` (y sus guardas de foco llevan `tabindex="0"`); no hay prop para desactivarlo y arreglarlo exige sustituir la primitiva o parchear su DOM. Queda sin tocar (no es un arreglo acotado).

## [0.3.1] · 2026-09-27

Parche sin cambios de API.

### Corregido

- `AppShell` y `AdminShell`: las opciones con `href` del menú de usuario usan el `linkComponent` del shell (en Next, `Link` de `next/link`); antes eran `<a>` y recargaban la página entera. En el cajón móvil, elegir una de esas opciones cierra el cajón, como los enlaces de la navegación.
- Revisados los demás enlaces de los shells: la marca, la navegación y las migas de `AppShell` / `AdminShell` y la cabecera y las pestañas de `StoreShell` ya usaban `linkComponent`; `KioskShell`, `PageShell`, `AuthLayout` y `CommandPalette` no renderizan enlaces propios.

## [0.3.0] · 2026-09-27

Componentes del Backoffice para la Ola 1 (O1-PK-1): alta de bodegas, equipos, configuración, bitácora y segundo factor. Sin rupturas respecto a 0.2.0.

### Añadido

- `Combobox`: patrón combobox de WAI-ARIA sobre el Popover de Radix (flechas, Enter, Esc, `aria-activedescendant`), filtro sin tildes, grupos, opciones desactivadas, selección simple o `multiple` (chips que se quitan con el botón o con Retroceso), `clearable`, búsqueda asíncrona con `loadOptions` (espera configurable, cancelación con `AbortSignal`, `minQueryLength`), estados de carga, vacío y error anunciados con `aria-live`, integración con `Field`.
- `CommandPalette`: buscador global (⌘K / Ctrl+K) en un diálogo modal, con grupos, iconos, atajos, navegación con flechas / Inicio / Fin, Enter, Esc, filtro en cliente o en el servidor (`filter={false}` + `onQueryChange`), carga y número de resultados anunciado con `aria-live`.
- `useHotkey`, `matchesHotkey`, `formatHotkey`, `isTypingTarget`, `isApplePlatform`: atajos de teclado (`"mod+k"`, `"/"`, `"escape"`…) que respetan los campos de texto.
- `DataTable`: `bulkActions` (barra de acciones masivas sobre la selección, con recuento anunciado), `column.filter` / `filterActive` (panel de filtro desde la cabecera), `pagination` (`limit` / `offset` con `Pagination` y tamaño de página opcional), `error` (ErrorState con reintento en el cuerpo) y `wrapperClassName`.
- `BulkActionBar`, `FilterBar` (controles, chips de filtros activos que se quitan con teclado y devuelven el foco, "Limpiar filtros", recuento con `aria-live`) y `DateRangePicker` (dos fechas nativas con validación de orden, mínimo, máximo y duración; preajustes; `validateDateRange`, `lastDaysRange`, `toIsoDate`, `daysInRange`; sin dependencias).
- `StatusBadge`, `getStatusBadge` y `statusBadgeMap`: estados del contrato de la Ola 1 (solicitudes, bodegas, invitaciones, miembros y alertas) sobre los tonos de estado AA; un estado desconocido se muestra en neutro.
- `ConfirmDialog` (AlertDialog de Radix, acción asíncrona con carga y error, variante destructiva, confirmación escrita con `confirmationText`) y `ReasonDialog` (motivo obligatorio de 3–500 caracteres con contador, validación, error del servidor con `reasonError`; `validateReason`).
- `OtpInput` (6 dígitos en casillas sobre un único campo: pegar, avance automático, `autocomplete="one-time-code"`, `onComplete`), `CopyField` (copiar con aviso anunciado, valor oculto con `masked`) y `SecretReveal` (QR `otpauth://`, clave agrupada, códigos de recuperación con copiar y descargar, casilla "He guardado…").
- `KpiCard` (StatCard con carga, desglose y enlace a la lista), `AlertsFeed` (niveles INFO / WARNING / CRITICAL con texto para lectores, acción por fila, carga, vacío, error y `live`), `RoleMatrix` (capacidades × roles con FULL / READ / OWN / NONE, cabeceras de fila y columna, leyenda) y `OrganizationSwitcher`.
- `AdminShell`: `commandPalette` (la paleta integrada que abren el buscador, ⌘K / Ctrl+K y `/`) y `organizationSwitcher` en la barra superior.
- `StatCard`: prop `footer`.
- Utilidades `normalizeText`, `matchesQuery`, `copyText` y `useCopy`.
- Storybook: historias de cada componente en los dos temas y en densidad compacta; la maqueta del Backoffice usa la paleta, el selector de organización, `KpiCard` y `AlertsFeed`.

### Cambiado

- `AdminShell`: el contenido usa Inter 14 px (`text-sm`, densidad del Backoffice, 05 §5); el atajo mostrado es "⌘K" en macOS y "Ctrl K" en el resto (antes siempre "⌘K"); `search.onOpen` pasa a ser opcional cuando se usa `commandPalette`.
- `DataTable`: el contenido de cada cabecera va dentro de un `<span>` en línea (para alinear el botón de filtro); sin `bulkActions` ni `pagination` el DOM exterior no cambia.

### Corregido (0.3.0-rc.2)

Accesibilidad detectada al construir el Backoffice.

- `RoleMatrix`: cuando la tabla desborda en horizontal, el contenedor desplazable es una región enfocable (`tabIndex=0`, nombre de la tabla, foco visible) que se recorre con las flechas (axe `scrollable-region-focusable`). Si cabe, no añade parada de tabulación. El componente pasa a ser de cliente.
- `CommandPalette`: al cerrarse ya no devuelve el foco a su disparador si la acción elegida abrió otro diálogo (el nuevo diálogo perdía el foco). El diálogo nuevo hereda el destino y, al cerrarse, devuelve el foco al disparador de la paleta.
- `ConfirmDialog` y `ReasonDialog`: la misma corrección cuando `onConfirm` abre otro diálogo; también `Modal`, `SlideOver` y `BottomSheet`, que comparten la devolución de foco. `Combobox` no tenía el problema (su panel nunca devuelve el foco); hay prueba que lo cubre.

## [0.2.0] · 2026-09-25

### Añadido

- `BrandSeal`: la chapa de las landings (versalitas, nombre entre hilos de oro y línea en cursiva) con `eyebrow` y `tagline` configurables, para las pantallas de acceso.
- `VineOrnament`, `GlassBottleOrnament` y `VineyardScene`: grabados a tinta que se dibujan solos (mapa de parcelas, curvas de nivel, río, vid, botella y copa) para el panel de imagen del `AuthLayout`. Respetan `prefers-reduced-motion`.

- Tokens de texto de estado `--doc-success-text`, `--doc-danger-text`, `--doc-warning-text` e `--doc-info-text` (utilidades `text-success-text`…), con contraste AA sobre su fondo `-soft` y sobre el papel en los dos temas.
- `EmptyState` y `ErrorState`: prop `headingLevel` (2 por defecto; antes siempre h4, que saltaba niveles).

### Cambiado

- **Oro tostado** en el tema Oro Líquido (decisión del 25-09-2026): `--doc-accent` pasa de `gold-500` (`#b8891f`) a `gold-700` (`#8a651a`); el texto claro sobre el botón principal y los badges fuertes cumple AA (5,2:1). El tema Cava Reserva no cambia.
- Badge fuerte de aviso sobre `warning-text` (antes 3,6:1).
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
