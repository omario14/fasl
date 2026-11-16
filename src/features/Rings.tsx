import { useMemo, useState } from 'react';
import { PRAYER_AR, PRAYER_COLOR, PRAYER_LATIN } from '../core/config';
import { dayArcs, streaks, type DayArcs } from '../core/rings';
import { useApp } from '../core/store';
import { addDays, keyOf, weekday, type YMD } from '../core/time';
import { PRAYERS, type PrayerId } from '../core/types';
import { useI18n } from '../i18n';
import type { Key } from '../i18n/en';
import { DayRing } from '../ui/DayRing';

const WEEKS = 5;
const NEUTRAL = Object.fromEntries(PRAYERS.map((p) => [p, 'upcoming'])) as DayArcs;

/** Five weeks of day rings ending today; pick a day to see or correct its marks. */
export default function RingsPage() {
  const { s, today, now, isPrayed, togglePrayed, data } = useApp();
  const i = useI18n();
  const { t } = i;
  const t0 = now.getTime();
  const [sel, setSel] = useState<YMD>(today);

  // Grid ends on the row holding today; columns start on Sunday like the calendar.
  const cells = useMemo(() => {
    const end = addDays(today, 6 - weekday(today));
    return Array.from({ length: WEEKS * 7 }, (_, k) => addDays(end, k - WEEKS * 7 + 1));
  }, [today]);
  const todayKey = keyOf(today);
  // Tracking starts on the first day anything was marked, so days before Fasl don't count as missed.
  const firstKey = Object.keys(data.prayed).map((k) => k.slice(0, 10)).sort()[0] ?? todayKey;
  const tracked = (k: string) => k >= firstKey && k <= todayKey;
  const past = cells.filter((c) => tracked(keyOf(c)));
  const rings = past.map((c) => dayArcs(s, c, t0, isPrayed));
  const completeDays = rings.filter((r) => r.complete).length;
  const marked = rings.reduce((a, r) => a + r.prayed, 0);
  const possible = rings.reduce((a, r) => a + PRAYERS.filter((p) => r.arcs[p] !== 'upcoming').length, 0);
  const { current, best } = streaks(s, today, t0, isPrayed);

  const selRing = dayArcs(s, sel, t0, isPrayed);
  const labels = Object.fromEntries(PRAYERS.map((p) => [p, `${s.lang === 'ar' ? PRAYER_AR[p] : PRAYER_LATIN[p]} · ${t(`st.${selRing.arcs[p]}` as Key)}`])) as Record<PrayerId, string>;

  return (
    <div className="page rings">
      <header className="page-head">
        <div>
          <h1 className="page-title">{t('ring.month')}</h1>
          <p className="page-sub">{t('ring.monthSub')}</p>
        </div>
      </header>

      <div className="rings-stats">
        <div className="card rstat">
          <b className="num">{i.digits(completeDays)}</b>
          <span>{t('ring.days')}</span>
        </div>
        <div className="card rstat">
          <b className="num">
            {i.digits(marked)}/{i.digits(possible)}
          </b>
          <span>{t('ring.prayers')}</span>
        </div>
        <div className="card rstat">
          <b className="num">{i.digits(current)}</b>
          <span>{t('ring.current')}</span>
        </div>
        <div className="card rstat">
          <b className="num">{i.digits(best)}</b>
          <span>{t('ring.best')}</span>
        </div>
      </div>

      <div className="rings-layout">
        <section className="card" aria-label={t('ring.month')}>
          <div className="rings-grid">
            {Array.from({ length: 7 }, (_, k) => (
              <span key={k} className="rings-wd" aria-hidden>
                {t(`wd.${k}` as Key)}
              </span>
            ))}
            {cells.map((c) => {
              const k = keyOf(c);
              if (k > todayKey) return <span key={k} className="rcell empty" aria-hidden />;
              const r = tracked(k) ? dayArcs(s, c, t0, isPrayed) : { arcs: NEUTRAL, prayed: 0 };
              return (
                <button
                  key={k}
                  className={`rcell ${k === todayKey ? 'today' : ''}`}
                  aria-pressed={k === keyOf(sel)}
                  aria-label={`${i.gregDate(c.y, c.m, c.d)} · ${t('ring.count', { n: r.prayed })}`}
                  onClick={() => setSel(c)}
                >
                  <DayRing arcs={r.arcs} size={48} compact center={null} />
                  <span className="num">{i.digits(c.d)}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="card rings-day" aria-live="polite">
          <p className="rings-day-date">{i.gregDate(sel.y, sel.m, sel.d, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <DayRing arcs={selRing.arcs} size={188} onToggle={(id) => togglePrayed(selRing.day.spans.find((sp) => sp.id === id)!)} labels={labels} />
          <p className="ringcard-count">{selRing.complete ? t('ring.complete') : t('ring.count', { n: selRing.prayed })}</p>
          <p className="ringcard-hint">{t('ring.hint')}</p>
          <div className="rings-legend">
            {PRAYERS.map((p) => (
              <span key={p}>
                <i style={{ background: PRAYER_COLOR[p] }} />
                <span className="ar" lang="ar">
                  {PRAYER_AR[p]}
                </span>
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
