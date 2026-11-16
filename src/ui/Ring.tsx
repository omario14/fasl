import { useEffect, useState, type ReactNode } from 'react';
import type { TimeWindow, WindowKind } from '../core/types';

export const WINDOW_COLOR: Record<WindowKind, string> = {
  preferred: '#4FC8A0',
  permissible: '#1D9E75',
  recommended: '#1D9E75',
  necessity: '#D4823A',
  obligation: '#D4823A',
  makrooh: '#7A7A7A',
  forbidden: '#A0473A',
};

export const WINDOW_AR: Record<WindowKind, string> = {
  preferred: 'وقت الفضيلة',
  permissible: 'وقت الجواز',
  recommended: 'وقت الاختيار',
  necessity: 'وقت الضرورة',
  obligation: 'وقت الوجوب',
  makrooh: 'وقت الكراهة',
  forbidden: 'وقت النهي',
};

/**
 * Circular arc progress. The track is divided into the prayer's windows (tinted), the fill shows
 * time elapsed in the urgency colour, and a gold bead marks "now".
 */
export function Ring({
  size,
  progress,
  color,
  windows,
  start,
  end,
  children,
  label,
}: {
  size: number;
  progress: number;
  color: string;
  windows?: TimeWindow[];
  start?: Date;
  end?: Date;
  children?: ReactNode;
  label: string;
}) {
  const stroke = Math.max(6, size * 0.05);
  const r = size / 2 - stroke;
  const c = size / 2;
  const C = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);

  // Arc fills from 0 to its value on entry (600ms), then follows the clock.
  useEffect(() => {
    const id = window.setTimeout(() => setShown(progress), 40);
    return () => clearTimeout(id);
  }, [progress]);

  const total = start && end ? end.getTime() - start.getTime() : 0;

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={label}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={stroke} />
        {windows && total > 0 &&
          windows.map((w, i) => {
            const a = (w.start.getTime() - start!.getTime()) / total;
            const b = (w.end.getTime() - start!.getTime()) / total;
            const len = Math.max(0, (b - a) * C - 3);
            return (
              <circle
                key={i}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={WINDOW_COLOR[w.kind]}
                strokeOpacity={0.22}
                strokeWidth={stroke}
                strokeDasharray={`${len} ${C}`}
                strokeDashoffset={-a * C}
                transform={`rotate(-90 ${c} ${c})`}
              />
            );
          })}
        <circle
          className="ring-fill"
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - shown)}
          transform={`rotate(-90 ${c} ${c})`}
        />
        <g className="ring-bead" style={{ transform: `rotate(${shown * 360}deg)` }}>
          <circle cx={c} cy={c - r} r={stroke * 0.62} fill="#C9A84C" stroke="var(--bg)" strokeWidth={2} />
        </g>
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

/** Small ring for the status bar — 40×40, 150ms linear updates. */
export function MiniArc({ progress, color, size = 40 }: { progress: number; color: string; size?: number }) {
  const r = size / 2 - 4;
  const C = 2 * Math.PI * r;
  return (
    <svg className="sb-arc" viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={4} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={C * (1 - progress)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
