"use client";

import { useId, type CSSProperties } from "react";
import { cn } from "../lib/utils";
import { GlassBottleOrnament, VineOrnament } from "./ink-ornaments";

// Escena grabada para las pantallas de acceso (panel de imagen del AuthLayout "split"):
// el mapa de parcelas de las landings —parcelas sombreadas a plumilla, curvas de nivel,
// el río y racimos de puntos— que se dibuja solo y deriva despacio, con la vid y la botella
// y copa en primer plano. Todo decorativo; respeta prefers-reduced-motion.

type Parcel = {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  skew: number;
  hatch: number;
};

// Parcelas fijas (no aleatorias) para que la composición sea siempre la misma.
const PARCELS: Parcel[] = [
  { x: 640, y: 30, w: 120, h: 90, rot: -18, skew: 8, hatch: 30 },
  { x: 330, y: 110, w: 170, h: 120, rot: -12, skew: -6, hatch: -40 },
  { x: 560, y: 180, w: 140, h: 150, rot: 14, skew: 10, hatch: 60 },
  { x: 90, y: 360, w: 180, h: 130, rot: 22, skew: -8, hatch: -25 },
  { x: 330, y: 330, w: 160, h: 150, rot: -28, skew: 6, hatch: 45 },
  { x: 560, y: 420, w: 190, h: 120, rot: -8, skew: -10, hatch: -60 },
  { x: 160, y: 590, w: 150, h: 140, rot: 12, skew: 12, hatch: 20 },
  { x: 390, y: 580, w: 170, h: 120, rot: 30, skew: -6, hatch: -35 },
  { x: 610, y: 660, w: 150, h: 150, rot: -20, skew: 8, hatch: 55 },
  { x: 420, y: 820, w: 150, h: 110, rot: 18, skew: 6, hatch: 35 },
];

const CONTOURS = [
  "M-40 260 C 120 200, 260 300, 420 250 S 700 170, 860 240",
  "M-40 300 C 140 250, 280 350, 430 300 S 690 220, 860 290",
  "M-40 520 C 100 470, 300 560, 470 510 S 720 450, 860 520",
  "M-40 560 C 120 520, 310 600, 480 556 S 730 500, 860 566",
  "M-40 760 C 160 720, 330 800, 520 750 S 740 700, 860 770",
];

const RIVER = "M860 60 C 700 160, 640 260, 520 330 S 300 460, 260 560 S 180 780, -40 940";

// Racimos de puntos (como las cepas en los mapas de las landings).
const DOTS: Array<[number, number]> = [
  [470, 250],
  [482, 262],
  [494, 250],
  [506, 262],
  [476, 274],
  [490, 280],
  [502, 274],
  [250, 520],
  [262, 532],
  [274, 520],
  [286, 532],
  [256, 544],
  [270, 550],
  [282, 544],
  [540, 610],
  [552, 622],
  [564, 610],
  [576, 622],
  [546, 634],
  [560, 640],
  [700, 330],
  [712, 342],
  [724, 330],
  [706, 354],
  [718, 358],
];

function parcelPath({ x, y, w, h, skew }: Parcel) {
  return `M${x} ${y} l ${w} ${skew} l ${-skew} ${h} l ${-w} ${-skew} z`;
}

export interface VineyardSceneProps {
  className?: string;
  /** Sin la vid ni la botella y copa (solo el mapa). */
  bare?: boolean;
}

export function VineyardScene({ className, bare = false }: VineyardSceneProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  let i = 0;
  const order = () => ({ "--i": i++ }) as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative size-full overflow-hidden bg-[linear-gradient(180deg,var(--doc-paper-1),var(--doc-paper-2))] text-fg",
        className,
      )}
    >
      <svg
        viewBox="0 0 800 1000"
        preserveAspectRatio="xMidYMid slice"
        className="doc-ink-drift absolute inset-0 size-full"
        focusable="false"
      >
        <defs>
          {PARCELS.map((p, k) => (
            <pattern
              key={k}
              id={`${uid}-hatch-${k}`}
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${p.hatch})`}
            >
              <line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          ))}
        </defs>

        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        >
          {CONTOURS.map((d) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              strokeWidth={0.7}
              className="doc-ink-stroke"
              style={order()}
            />
          ))}
          <path
            d={RIVER}
            pathLength={1}
            strokeWidth={1.6}
            className="doc-ink-stroke"
            style={order()}
          />
          <path
            d={RIVER}
            pathLength={1}
            strokeWidth={0.6}
            transform="translate(10 6)"
            className="doc-ink-stroke"
            style={{ ...order(), "--extra": 1 } as CSSProperties}
          />
        </g>

        {PARCELS.map((p, k) => {
          const style = order();
          const center = `${p.x + p.w / 2} ${p.y + p.h / 2}`;
          return (
            <g key={k} transform={`rotate(${p.rot} ${center})`}>
              <path
                d={parcelPath(p)}
                fill={`url(#${uid}-hatch-${k})`}
                stroke="none"
                opacity={0.14}
                className="doc-ink-fill"
                style={style}
              />
              <path
                d={parcelPath(p)}
                fill="none"
                stroke="currentColor"
                strokeWidth={0.9}
                opacity={0.4}
                pathLength={1}
                className="doc-ink-stroke"
                style={style}
              />
            </g>
          );
        })}

        <g fill="none" stroke="currentColor" strokeWidth={0.8} opacity={0.45}>
          {DOTS.map(([cx, cy], k) => (
            <circle
              key={k}
              cx={cx}
              cy={cy}
              r={4.2}
              pathLength={1}
              className="doc-ink-stroke"
              style={{ "--i": 6 + k * 0.25 } as CSSProperties}
            />
          ))}
        </g>
      </svg>

      {/* Velo de papel para que el texto del pie se lea sobre el grabado */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(0deg,var(--doc-paper-1),transparent)]" />

      {bare ? null : (
        <>
          <VineOrnament
            className="doc-ink-float absolute -top-4 -left-6 w-[46%] max-w-80"
            delay={0.6}
          />
          <GlassBottleOrnament
            className="absolute right-[4%] bottom-[6%] w-[42%] max-w-72 opacity-70"
            delay={1.6}
          />
        </>
      )}
    </div>
  );
}
