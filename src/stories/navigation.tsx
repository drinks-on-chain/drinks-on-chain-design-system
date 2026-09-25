// Navegación de ejemplo de cada sistema (historias y maquetas).
import {
  BadgeCheck,
  Barrel,
  Boxes,
  Building2,
  FlaskConical,
  Grape,
  Home,
  LayoutDashboard,
  LifeBuoy,
  MapPinned,
  QrCode,
  ScanLine,
  ScrollText,
  Settings,
  Tablet,
  User,
  Users,
  Wallet,
  Warehouse,
  Wine,
} from "lucide-react";
import type { NavGroup, NavItem } from "../lib/link";

export const erpNavigation: NavGroup[] = [
  { items: [{ label: "Panel", href: "/", icon: <LayoutDashboard /> }] },
  {
    label: "Trazabilidad",
    items: [
      { label: "Origen y terroirs", href: "/origen", icon: <MapPinned /> },
      { label: "Vendimia y laboratorio", href: "/vendimia", icon: <Grape /> },
      { label: "Vinificación", href: "/vinificacion", icon: <Warehouse /> },
      { label: "Crianza", href: "/crianza", icon: <Barrel /> },
      { label: "Destilación y reposo", href: "/destilacion", icon: <FlaskConical /> },
      { label: "Envasado y QR", href: "/envasado", icon: <QrCode /> },
    ],
  },
  {
    label: "Bodega",
    items: [
      { label: "Cuenta Stellar", href: "/cuenta", icon: <Wallet /> },
      { label: "Ajustes", href: "/ajustes", icon: <Settings /> },
    ],
  },
];

export const adminNavigation: NavGroup[] = [
  { items: [{ label: "Dashboard", href: "/", icon: <LayoutDashboard /> }] },
  {
    label: "Red",
    items: [
      { label: "Bodegas", href: "/bodegas", icon: <Building2 /> },
      { label: "Puntos de recojo", href: "/puntos", icon: <MapPinned /> },
      { label: "Dispositivos POS", href: "/dispositivos", icon: <Tablet /> },
    ],
  },
  {
    label: "Producto",
    items: [
      { label: "Tokenización", href: "/tokenizacion", icon: <BadgeCheck /> },
      { label: "Colecciones", href: "/colecciones", icon: <Boxes /> },
    ],
  },
  {
    label: "Operación",
    items: [
      { label: "Soporte", href: "/soporte", icon: <LifeBuoy /> },
      { label: "Auditoría", href: "/auditoria", icon: <ScrollText /> },
      { label: "Usuarios y roles", href: "/usuarios", icon: <Users /> },
    ],
  },
];

export const storeTabs: NavItem[] = [
  { label: "Inicio", href: "/", icon: <Home /> },
  { label: "Escáner", href: "/escaner", icon: <ScanLine /> },
  { label: "Cava", href: "/cava", icon: <Wine /> },
  { label: "Perfil", href: "/perfil", icon: <User /> },
];

export const storeDesktopNavigation: NavItem[] = [
  { label: "Catálogo", href: "/" },
  { label: "Bodegas", href: "/bodegas" },
  { label: "Mi cava", href: "/cava" },
];
