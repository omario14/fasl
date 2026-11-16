import { toHijri } from '../core/hijri';
import { computeDay } from '../core/prayer';
import { useApp } from '../core/store';
import { useI18n } from '../i18n';

/** Ramadan mode: Suhoor and Iftar times plus the 30-day fasting tracker. */
export function RamadanCard() {
  const { s, today, data, setData } = useApp();
  const { t, time, digits } = useI18n();
  const day = computeDay(s, today);
  const h = toHijri(today, s.hijriOffset);
  const inRamadan = h.m === 9;
  const dayN = inRamadan ? h.d : 0;
  const key = (d: number) => `${h.y}-${d}`;
  const fasted = Array.from({ length: 30 }, (_, k) => !!data.ramadan[key(k + 1)]).filter(Boolean).length;
  return (
    <section className="section ramadan card" aria-labelledby="rmd-title">
      <div className="section-head">
        <h2 id="rmd-title" className="section-title">
          {t('rmd.title')} <span className="ar" lang="ar">رمضان</span>
        </h2>
        {inRamadan && <span className="caps">{t('rmd.day', { n: dayN, t: 30 })}</span>}
      </div>
      <div className="rmd-times">
        <div style={{ ['--tone' as string]: '#3A6EA8' }}>
          <span className="caps">{t('rmd.suhoor')}</span>
          <b className="num">{time(day.fajr)}</b>
        </div>
        <div style={{ ['--tone' as string]: '#B85C3A' }}>
          <span className="caps">{t('rmd.iftar')}</span>
          <b className="num">{time(day.maghrib)}</b>
        </div>
      </div>
      <div className="section-head" style={{ marginTop: 16, marginBottom: 8 }}>
        <span className="caps">{t('rmd.tracker')}</span>
        <span className="caps">{t('rmd.fasted', { n: fasted })}</span>
      </div>
      <div className="rmd-grid" role="group" aria-label={t('rmd.tracker')}>
        {Array.from({ length: 30 }, (_, k) => {
          const d = k + 1;
          const on = !!data.ramadan[key(d)];
          const future = inRamadan ? d > dayN : true;
          return (
            <button
              key={d}
              className={`rmd-cell ${on ? 'on' : ''} ${d === dayN ? 'today' : ''}`}
              disabled={future}
              aria-pressed={on}
              aria-label={`${t('rmd.day', { n: d, t: 30 })}`}
              onClick={() => setData((x) => ({ ramadan: { ...x.ramadan, [key(d)]: !on } }))}
            >
              {digits(d)}
            </button>
          );
        })}
      </div>
    </section>
  );
}
