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

// Formularios
export { Field, useFieldContext, useFieldControl, type FieldProps } from "./components/field";
export {
  Input,
  Textarea,
  inputVariants,
  type InputProps,
  type TextareaProps,
} from "./components/input";
export {
  Select,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  type SelectOption,
  type SelectProps,
  type SelectItemProps,
} from "./components/select";
export { Checkbox, type CheckboxProps } from "./components/checkbox";
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
  type RadioOption,
} from "./components/radio-group";
export { Switch, type SwitchProps } from "./components/switch";
export { FormSection, type FormSectionProps } from "./components/form-section";

// Feedback
export { Spinner, type SpinnerProps } from "./components/spinner";
