import type { KeyboardEvent, ReactNode } from 'react';
import { PRAYER_COLOR, PRAYER_LATIN } from '../core/config';
import type { DayArcs } from '../core/rings';
import { PRAYERS, type PrayerId } from '../core/types';

const R = 38;
const GAP = 9;
const C = 50;
const pt = (deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + R * Math.cos(a), C + R * Math.sin(a)];
};
const ARC_LEN = ((2 * Math.PI * R) / 360) * (72 - GAP);

/**
 * The day ring — the Fasl mark as a record of the day. Five arcs (Fajr at the top, clockwise),
 * each filling in its prayer's colour when marked prayed. Complete days glow with the gold ف.
 */
export function DayRing({
  arcs,
  size = 120,
  onToggle,
  labels,
  center,
  compact = false,
}: {
  arcs: DayArcs;
  size?: number;
  onToggle?: (id: PrayerId) => void;
  labels?: Partial<Record<PrayerId, string>>;
  center?: ReactNode;
  compact?: boolean;
}) {
  const complete = PRAYERS.every((p) => arcs[p] === 'prayed');
  const sw = compact ? 10 : 8;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`dayring ${complete ? 'complete' : ''} ${compact ? 'compact' : ''}`}
      role={onToggle ? 'group' : 'img'}
      aria-label={PRAYERS.map((p) => `${PRAYER_LATIN[p]}: ${arcs[p]}`).join(', ')}
    >
      {PRAYERS.map((p, i) => {
        const [x0, y0] = pt(i * 72 + GAP / 2);
        const [x1, y1] = pt((i + 1) * 72 - GAP / 2);
        const d = `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`;
        const st = arcs[p];
        const can = !!onToggle && st !== 'upcoming';
        const key = (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle?.(p);
          }
        };
        return (
          <g key={p} className={`arc arc-${st}`} style={{ ['--pc' as string]: PRAYER_COLOR[p] }}>
            <path d={d} className="arc-track" strokeWidth={sw} />
            <path
              d={d}
              className="arc-fill"
              strokeWidth={sw}
              style={{ strokeDasharray: ARC_LEN, strokeDashoffset: st === 'prayed' ? 0 : ARC_LEN }}
            />
            {can && (
              <path
                d={d}
                className="arc-hit"
                strokeWidth={22}
                role="button"
                tabIndex={0}
                aria-pressed={st === 'prayed'}
                aria-label={labels?.[p] ?? PRAYER_LATIN[p]}
                onClick={() => onToggle!(p)}
                onKeyDown={key}
              />
            )}
          </g>
        );
      })}
      {!compact &&
        PRAYERS.map((p, i) => {
          const [x, y] = pt(i * 72);
          return <circle key={p} cx={x} cy={y} r={3.2} className="ring-joint" />;
        })}
      {center === undefined ? (
        <text x="50" y="63" textAnchor="middle" className="ring-glyph">
          ف
        </text>
      ) : (
        <foreignObject x="20" y="20" width="60" height="60">
          <div className="ring-center-slot">{center}</div>
        </foreignObject>
      )}
    </svg>
  );
}
