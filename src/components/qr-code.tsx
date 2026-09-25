import QRCodeLib from "qrcode";
import type { SVGAttributes } from "react";
import { cn } from "../lib/utils";

export interface QRCodeProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  /** Texto o URL a codificar. */
  value: string;
  /** Lado en px. */
  size?: number;
  /** Módulos de margen (zona de silencio). */
  margin?: number;
  /** Corrección de errores. */
  level?: "L" | "M" | "Q" | "H";
  /** Texto alternativo. */
  label?: string;
}

/** Trazado SVG de los módulos oscuros del código. */
export function getQRPath(value: string, level: QRCodeProps["level"] = "M") {
  const qr = QRCodeLib.create(value, { errorCorrectionLevel: level });
  const { size, data } = qr.modules;
  let path = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (data[row * size + col]) path += `M${col} ${row}h1v1h-1z`;
    }
  }
  return { path, modules: size };
}

/**
 * Código QR en SVG, siempre tinta sobre papel claro (legible en ambos temas y a máximo brillo).
 */
export function QRCode({
  value,
  size = 168,
  margin = 2,
  level = "M",
  label = "Código QR",
  className,
  ...props
}: QRCodeProps) {
  const { path, modules } = getQRPath(value, level);
  const box = modules + margin * 2;
  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox={`${-margin} ${-margin} ${box} ${box}`}
      shapeRendering="crispEdges"
      className={cn("block rounded-sm", className)}
      {...props}
    >
      <rect x={-margin} y={-margin} width={box} height={box} fill="#fdfcf5" />
      <path d={path} fill="#000000" />
    </svg>
  );
}
