import type { CSSProperties } from 'react';
import { PRAYER_COLOR } from '../core/config';
import { PRAYERS } from '../core/types';

/**
 * The Fasl mark — a pentagonal arc ring. Five arcs (Fajr at the top, clockwise to Isha), each in
 * the colour of the sky at its hour; gold dots at the five joints like zellige grout; ف at the centre.
 */
export function Mark({ size = 40, animate = false, title }: { size?: number; animate?: boolean; title?: string }) {
  const c = 50;
  const r = 38;
  const gap = 9; // degrees between arcs
  const showGlyph = size > 16;
  const showDots = size >= 40;
  const sw = size <= 24 ? 9 : 7;
  const pt = (deg: number, rad = r) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [c + rad * Math.cos(a), c + rad * Math.sin(a)];
  };
  const len = ((2 * Math.PI * r) / 360) * (72 - gap);
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={animate ? 'mark mark-draw' : 'mark'}
    >
      {PRAYERS.map((p, i) => {
        const a0 = i * 72 + gap / 2;
        const a1 = (i + 1) * 72 - gap / 2;
        const [x0, y0] = pt(a0);
        const [x1, y1] = pt(a1);
        return (
          <path
            key={p}
            d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`}
            fill="none"
            stroke={PRAYER_COLOR[p]}
            strokeWidth={sw}
            strokeLinecap="round"
            style={animate ? ({ strokeDasharray: len, strokeDashoffset: len, animationDelay: `${300 + i * 600}ms` } as CSSProperties) : undefined}
          />
        );
      })}
      {showDots &&
        PRAYERS.map((p, i) => {
          const [x, y] = pt(i * 72);
          return (
            <circle
              key={p}
              cx={x}
              cy={y}
              r={3.4}
              fill="#C9A84C"
              className={animate ? 'mark-dot' : undefined}
              style={animate ? { animationDelay: `${300 + i * 600 + 500}ms` } : undefined}
            />
          );
        })}
      {showGlyph && (
        <text
          x="50"
          y={size <= 40 ? 63 : 62}
          textAnchor="middle"
          fontFamily="Amiri, 'Noto Naskh Arabic', serif"
          fontWeight="700"
          fontSize={size <= 40 ? 46 : 42}
          fill="#C9A84C"
          className={animate ? 'mark-glyph' : undefined}
        >
          ف
        </text>
      )}
    </svg>
  );
}
