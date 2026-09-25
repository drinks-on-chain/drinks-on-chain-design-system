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

// Estado y datos
export { Badge, badgeVariants, type BadgeProps } from "./components/badge";
export { Tag, type TagProps } from "./components/tag";
export { Pill, PillGroup, type PillProps, type PillGroupProps } from "./components/pill";
export { Avatar, getInitials, type AvatarProps } from "./components/avatar";
export {
  Card,
  CardHeader,
  cardVariants,
  type CardProps,
  type CardHeaderProps,
} from "./components/card";
export { Divider, type DividerProps } from "./components/divider";
export {
  KeyValueList,
  type KeyValueItem,
  type KeyValueListProps,
} from "./components/key-value-list";
export { StatCard, type StatCardProps } from "./components/stat-card";
export {
  DataTable,
  compareValues,
  type DataTableColumn,
  type DataTableLabels,
  type DataTableProps,
  type SortDirection,
  type SortState,
} from "./components/data-table";
export { Timeline, type TimelineItem, type TimelineProps } from "./components/timeline";
export {
  Countdown,
  getCountdownParts,
  type CountdownLabels,
  type CountdownParts,
  type CountdownProps,
} from "./components/countdown";
export { QRCode, getQRPath, type QRCodeProps } from "./components/qr-code";
export { Wordmark, type WordmarkProps } from "./components/wordmark";

// Feedback
export { Alert, type AlertProps } from "./components/alert";
export {
  Toast,
  Toaster,
  toast,
  type ToastOptions,
  type ToastProps,
  type ToastTone,
  type ToasterProps,
} from "./components/toast";
export {
  Skeleton,
  SkeletonText,
  type SkeletonProps,
  type SkeletonTextProps,
} from "./components/skeleton";
export { Spinner, type SpinnerProps } from "./components/spinner";
export { Progress, type ProgressProps } from "./components/progress";
export { EmptyState, type EmptyStateProps } from "./components/empty-state";
export { ErrorState, type ErrorStateProps } from "./components/error-state";

// Navegación
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/tabs";
export { Breadcrumbs, type BreadcrumbItem, type BreadcrumbsProps } from "./components/breadcrumbs";
export {
  Pagination,
  getPageItems,
  type PageItem,
  type PaginationLabels,
  type PaginationProps,
} from "./components/pagination";
export { Stepper, type StepperProps, type StepperStep } from "./components/stepper";

// Overlays
export { Modal, ModalClose, type ModalProps } from "./components/modal";
export { SlideOver, type SlideOverProps } from "./components/slide-over";
export { BottomSheet, type BottomSheetProps } from "./components/bottom-sheet";
export { Popover, PopoverClose, type PopoverProps } from "./components/popover";
export { Menu, type MenuEntry, type MenuProps } from "./components/menu";
export { Tooltip, type TooltipProps } from "./components/tooltip";

// Shells
export { AppShell, type AppShellProps, type ShellLabels, type ShellUser } from "./shells/app-shell";
export { AdminShell, type AdminShellProps, type AdminShellSearch } from "./shells/admin-shell";
export { StoreShell, type StoreShellProps } from "./shells/store-shell";
export { KioskShell, type KioskShellProps } from "./shells/kiosk-shell";
export { AuthLayout, type AuthLayoutProps } from "./shells/auth-layout";
export { PageShell, type PageShellProps } from "./shells/page-shell";
