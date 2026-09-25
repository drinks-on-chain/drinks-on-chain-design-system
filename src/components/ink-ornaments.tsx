import type { CSSProperties } from "react";
import { cn } from "../lib/utils";

// Ornamentos grabados a tinta (familia editorial, 05 §3.2), los mismos de las landings.
// Se dibujan trazo a trazo (pathLength = 1 + animación de guion) y respetan reduced-motion.

export interface InkOrnamentProps {
  className?: string;
  /** Segundos antes de empezar a dibujar. */
  delay?: number;
}

function useStroke() {
  let i = 0;
  const stroke = (d: string, w = 1.1, extra = 0) => (
    <path
      key={i}
      d={d}
      pathLength={1}
      className="doc-ink-stroke"
      strokeWidth={w}
      style={{ "--i": i++, "--extra": extra } as CSSProperties}
    />
  );
  return { stroke, next: () => i };
}

/** Sarmiento con racimo, zarcillos y tres hojas. Decorativo. */
export function VineOrnament({
  className,
  delay = 0,
  flip = false,
}: InkOrnamentProps & { flip?: boolean }) {
  const { stroke, next } = useStroke();
  const grapes: Array<[number, number, number]> = [
    [262, 248, 9],
    [280, 244, 9],
    [298, 250, 9],
    [254, 264, 9],
    [272, 262, 9],
    [290, 264, 9],
    [308, 268, 9],
    [263, 280, 8.5],
    [281, 280, 8.5],
    [299, 284, 8.5],
    [271, 297, 8],
    [289, 299, 8],
    [280, 314, 7.5],
    [297, 312, 7],
    [288, 328, 6.5],
  ];
  return (
    <svg
      viewBox="0 0 420 420"
      className={cn("block overflow-visible text-fg opacity-60", flip && "-scale-x-100", className)}
      style={{ "--delay": `${delay}s` } as CSSProperties}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* main shoot */}
        {stroke("M20 400 C 80 330, 120 300, 150 250 S 200 150, 250 130 S 340 110, 400 60", 1.4)}
        {/* secondary shoot toward the cluster */}
        {stroke("M150 250 C 190 240, 230 225, 262 232", 1.1)}
        {/* tendrils */}
        {stroke(
          "M250 130 c 20 -30, 45 -25, 40 -5 c -4 14, -22 12, -20 0 c 2 -8, 12 -8, 12 -1",
          0.9,
        )}
        {stroke(
          "M110 300 c -30 -10, -50 10, -38 28 c 8 12, 26 4, 20 -8 c -4 -8, -14 -5, -12 2",
          0.9,
        )}
        {stroke(
          "M330 100 c 18 -28, 48 -30, 50 -8 c 1 12, -14 18, -20 8 c -4 -8, 4 -14, 10 -8",
          0.9,
        )}
        {/* leaves: five-lobed, veins */}
        {stroke(
          "M190 200 c -30 -40, -70 -30, -80 -60 c 30 -10, 50 8, 60 20 c -20 -35, -5 -70, 25 -85 c 15 30, 10 60, 5 70 c 20 -30, 55 -35, 80 -20 c -25 25, -50 30, -70 30 c 30 10, 45 40, 40 60 c -25 -10, -45 -25, -60 -15 z",
          1.1,
        )}
        {stroke(
          "M190 200 l 5 -80 M190 200 l -60 -50 M190 200 l 70 -30 M190 200 l 20 45 M190 200 l -45 25",
          0.7,
          1,
        )}
        {stroke(
          "M320 150 c -25 -30, -55 -25, -60 -50 c 25 -6, 40 8, 48 18 c -15 -30, -2 -55, 22 -66 c 12 25, 8 48, 4 56 c 16 -24, 44 -28, 64 -16 c -20 20, -40 24, -56 24 c 24 8, 36 32, 32 48 c -20 -8, -36 -20, -48 -12 z",
          1.0,
        )}
        {stroke("M320 150 l 6 -62 M320 150 l -48 -40 M320 150 l 56 -24 M320 150 l 14 36", 0.7, 1)}
        {stroke(
          "M96 342 c -20 -26, -46 -22, -50 -42 c 20 -5, 34 6, 40 15 c -12 -25, -2 -46, 18 -55 c 10 20, 7 40, 3 47 c 13 -20, 36 -23, 53 -13 c -17 17, -33 20, -46 20 c 20 7, 30 27, 27 40 c -17 -7, -30 -17, -40 -10 z",
          1.0,
        )}
        {stroke("M96 342 l 5 -52 M96 342 l -40 -34 M96 342 l 46 -20 M96 342 l 12 30", 0.7, 1)}
        {/* grape cluster: outline circles + a little hatch on each berry */}
        {grapes.map(([cx, cy, r], k) => (
          <g key={`g${k}`}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              pathLength={1}
              className="doc-ink-stroke"
              strokeWidth={0.95}
              style={{ "--i": next() + k * 0.35, "--extra": 0 } as CSSProperties}
            />
            <path
              d={`M${cx - r * 0.55} ${cy + r * 0.35} q ${r * 0.5} ${r * 0.5} ${r * 1.05} 0`}
              pathLength={1}
              className="doc-ink-stroke"
              strokeWidth={0.6}
              style={{ "--i": next() + k * 0.35 + 0.2, "--extra": 1 } as CSSProperties}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Botella y copa sobre la mesa. Decorativo. */
export function GlassBottleOrnament({ className, delay = 0 }: InkOrnamentProps) {
  const { stroke } = useStroke();
  return (
    <svg
      viewBox="0 0 420 420"
      className={cn("block overflow-visible text-fg opacity-60", className)}
      style={{ "--delay": `${delay}s` } as CSSProperties}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* table line */}
        {stroke("M40 392 C 140 386, 300 386, 400 392", 0.9, 1)}

        {/* bottle: neck, shoulders, body */}
        {stroke("M150 60 h30 v14 h-30 z", 1.2)}
        {stroke(
          "M154 74 v 90 c 0 22 -32 34 -32 70 v 148 c 0 6 4 10 10 10 h 66 c 6 0 10 -4 10 -10 v -148 c 0 -36 -32 -48 -32 -70 v -90",
          1.3,
        )}
        {/* capsule ring and label */}
        {stroke("M154 118 h 22", 0.8, 1)}
        {stroke("M128 258 h 74 M128 336 h 74", 0.9)}
        {stroke("M140 274 h 50 M146 288 h 38 M150 302 h 30", 0.7, 1)}
        {/* bottle shading: hatch on the left side */}
        {stroke("M126 250 l 0 128 M132 240 l 0 140 M138 236 l 0 146", 0.55, 1)}
        {stroke("M130 238 c -4 40 -4 90 0 132", 0.6, 1)}

        {/* glass: bowl, wine level, stem, foot */}
        {stroke("M262 214 c -6 60 20 108 58 116 c 38 -8 64 -56 58 -116 z", 1.3)}
        {stroke("M268 262 c 20 10 84 10 104 0", 0.9)}
        {stroke("M270 270 c 18 -6 82 -6 100 0", 0.7, 1)}
        {stroke("M320 330 v 46", 1.2)}
        {stroke("M282 384 c 10 -6 66 -6 76 0 c -10 6 -66 6 -76 0 z", 1.1)}
        {/* wine shading in the bowl */}
        {stroke(
          "M272 276 c 6 26 22 42 48 48 M278 294 c 8 16 20 26 40 30 M286 310 c 6 8 14 14 26 16",
          0.7,
          1,
        )}
        {/* glass highlight */}
        {stroke("M272 226 c -2 20 2 44 12 60", 0.6, 1)}

        {/* a stray grape leaf on the table */}
        {stroke(
          "M72 380 c -14 -14 -26 -10 -28 -22 c 12 -3 20 4 24 9 c -8 -16 -2 -28 10 -33 c 6 12 4 24 2 28 c 8 -12 22 -14 32 -8 c -10 10 -20 12 -28 12 c 12 4 18 16 16 24 c -10 -4 -18 -10 -24 -6 z",
          0.9,
        )}
        {stroke("M72 380 l 4 -34 M72 380 l -24 -20 M72 380 l 28 -12", 0.6, 1)}
      </g>
    </svg>
  );
}
