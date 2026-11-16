import { PRAYER_AR, PRAYER_LATIN } from '../core/config';
import { dayArcs, streaks } from '../core/rings';
import { href } from '../core/router';
import { useApp } from '../core/store';
import { PRAYERS, type PrayerId } from '../core/types';
import { useI18n } from '../i18n';
import { DayRing } from '../ui/DayRing';
import { IChevron } from '../ui/Icons';

/** Today's ring on the dashboard: tap an arc to mark its prayer; streak below. */
export function RingCard() {
  const { s, today, now, isPrayed, togglePrayed } = useApp();
  const { t } = useI18n();
  const t0 = now.getTime();
  const { day, arcs, prayed, complete } = dayArcs(s, today, t0, isPrayed);
  const { current } = streaks(s, today, t0, isPrayed);
  const labels = Object.fromEntries(PRAYERS.map((p) => [p, `${s.lang === 'ar' ? PRAYER_AR[p] : PRAYER_LATIN[p]} · ${t(`st.${arcs[p]}`)}`])) as Record<PrayerId, string>;
  const toggle = (id: PrayerId) => togglePrayed(day.spans.find((sp) => sp.id === id)!);
  return (
    <section className="section ringcard card" aria-labelledby="ring-title">
      <DayRing arcs={arcs} size={112} onToggle={toggle} labels={labels} />
      <div className="ringcard-text">
        <p id="ring-title" className="caps">
          {t('ring.title')}
        </p>
        <p className="ringcard-count">{complete ? t('ring.complete') : t('ring.count', { n: prayed })}</p>
        <p className="ringcard-streak">{current > 0 ? `◆ ${t('ring.streak', { n: current })}` : t('ring.noStreak')}</p>
        {!complete && <p className="ringcard-hint">{t('ring.hint')}</p>}
        <a className="btn btn-quiet" href={href('/rings')}>
          {t('ring.seeMonth')}
          <IChevron className="flip" width={16} height={16} />
        </a>
      </div>
    </section>
  );
}
