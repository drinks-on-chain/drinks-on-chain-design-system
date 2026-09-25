// @drinks-on-chain/ui · API pública.
// Este índice no lleva "use client": cada componente interactivo declara la directiva
// en su propio módulo, así que `cn`, los tipos y los componentes estáticos siguen
// siendo utilizables desde React Server Components.

// Utilidades y tipos
export { cn } from "./lib/utils";
export { focusRing } from "./lib/styles";
export type { Tone, ThemeName } from "./lib/types";
export {
  isNavItemActive,
  type LinkComponent,
  type LinkComponentProps,
  type NavGroup,
  type NavItem,
} from "./lib/link";

// Tema
export { ThemeProvider, useTheme, type ThemeProviderProps } from "./theme/theme-provider";

// Acciones
export { Button, buttonVariants, type ButtonProps } from "./components/button";
export { IconButton, iconButtonVariants, type IconButtonProps } from "./components/icon-button";
export { TextLink, type TextLinkProps } from "./components/text-link";

// Feedback
export { Spinner, type SpinnerProps } from "./components/spinner";
