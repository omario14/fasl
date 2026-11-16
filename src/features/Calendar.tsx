import { useMemo, useState } from 'react';
import { ramadanActive } from '../core/alerts';
import { PRAYER_AR, PRAYER_COLOR } from '../core/config';
import { eventOn, HIJRI_MONTHS, hijriMonthDays, nextEvent } from '../core/hijri';
import { computeDay } from '../core/prayer';
import { useApp } from '../core/store';
import { addDays, keyOf, weekday, type YMD } from '../core/time';
import { useI18n } from '../i18n';
import type { Key } from '../i18n/en';
import { IBack, IChevron } from '../ui/Icons';
import { RamadanCard } from './Ramadan';

export default function CalendarPage() {
  const { s, today, pos } = useApp();
  const i = useI18n();
  const { t, time, digits } = i;
  const [anchor, setAnchor] = useState<YMD>(today);
  const [sel, setSel] = useState<YMD>(today);
  const month = useMemo(() => hijriMonthDays(anchor, s.hijriOffset), [anchor, s.hijriOffset]);
  const lead = (weekday(month.days[0].g) + 7) % 7;
  const selDay = computeDay(s, sel);
  const selH = month.days.find((d) => keyOf(d.g) === keyOf(sel))?.h;
  const selEvent = selH ? eventOn(selH) : null;
  const upcoming = useMemo(() => nextEvent(today, s.hijriOffset, { majorOnly: true }), [today, s.hijriOffset]);
  const chapter = PRAYER_COLOR[pos.active?.id ?? pos.next.id];
  const g0 = month.days[0].g;
  const g1 = month.days[month.days.length - 1].g;
  const gregSpan = `${i.gregDate(g0.y, g0.m, g0.d, { month: 'long' })} – ${i.gregDate(g1.y, g1.m, g1.d, { month: 'long', year: 'numeric' })}`;
  const hijriFirst = s.datePrimary === 'hijri';

  const shift = (dir: 1 | -1) => {
    const edge = dir === 1 ? addDays(g1, 1) : addDays(g0, -1);
    setAnchor(edge);
  };

  const evName = upcoming ? t(`ev.${upcoming.event.id}` as Key) : '';

  return (
    <div className="page cal" style={{ ['--chapter' as string]: chapter }}>
      <header className="page-head">
        <div>
          <h1 className="page-title">
            {HIJRI_MONTHS[s.lang][month.month - 1]} {digits(month.year)}
          </h1>
          <p className="page-sub">
            <span className="ar" lang="ar">
              {HIJRI_MONTHS.ar[month.month - 1]}
            </span>{' '}
            · {gregSpan}
          </p>
        </div>
        <div className="cal-nav">
          <button className="icon-btn" onClick={() => shift(-1)} aria-label={t('cal.prev')}>
            <IBack className="flip" />
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setAnchor(today);
              setSel(today);
            }}
          >
            {t('cal.today')}
          </button>
          <button className="icon-btn" onClick={() => shift(1)} aria-label={t('cal.next')}>
            <IChevron className="flip" />
          </button>
        </div>
      </header>

      <div className="cal-layout">
        <section className="card cal-card">
          <div className="cal-grid cal-wd" aria-hidden>
            {Array.from({ length: 7 }, (_, k) => (
              <span key={k} className={k === 5 ? 'fri' : ''}>
                {t(`wd.${k}` as Key)}
              </span>
            ))}
          </div>
          <div className="cal-grid" role="grid" aria-label={HIJRI_MONTHS[s.lang][month.month - 1]}>
            {Array.from({ length: lead }, (_, k) => (
              <span key={`b${k}`} className="cal-blank" />
            ))}
            {month.days.map(({ g, h }) => {
              const k = keyOf(g);
              const ev = eventOn(h);
              const isToday = k === keyOf(today);
              const isSel = k === keyOf(sel);
              return (
                <button
                  key={k}
                  role="gridcell"
                  className={`cal-day ${isToday ? 'today' : ''} ${isSel ? 'sel' : ''} ${ev ? 'ev' : ''} ${ev?.major ? 'major' : ''}`}
                  aria-selected={isSel}
                  aria-label={`${h.d} ${HIJRI_MONTHS[s.lang][h.m - 1]} · ${i.gregDate(g.y, g.m, g.d)}${ev ? ' · ' + t(`ev.${ev.id}` as Key) : ''}`}
                  onClick={() => setSel(g)}
                >
                  <span className="cd-main num">{hijriFirst ? digits(h.d) : digits(g.d)}</span>
                  <span className="cd-sub num">{hijriFirst ? digits(g.d) : digits(h.d)}</span>
                  {ev && <span className="cd-dot" aria-hidden />}
                </button>
              );
            })}
          </div>
          <div className={`cal-strip ${selEvent ? 'has' : ''}`} aria-live="polite">
            {selEvent ? (
              <>
                <span className="cd-dot static" aria-hidden />
                {t(`ev.${selEvent.id}` as Key)}
              </>
            ) : (
              i.gregDate(sel.y, sel.m, sel.d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            )}
          </div>
        </section>

        <div className="cal-side">
          <section className="card cal-times" aria-labelledby="ct">
            <h2 id="ct" className="section-title">
              {t('cal.prayers')} · {selH ? `${digits(selH.d)} ${HIJRI_MONTHS[s.lang][selH.m - 1]}` : ''}
            </h2>
            <div className="ct-row">
              {selDay.spans.map((sp) => (
                <div key={sp.id} style={{ ['--chapter' as string]: PRAYER_COLOR[sp.id] }}>
                  <span className="ar" lang="ar">
                    {PRAYER_AR[sp.id]}
                  </span>
                  <b className="num">{time(sp.adhan)}</b>
                </div>
              ))}
            </div>
          </section>

          {upcoming && (
            <section className="card countdown" aria-label={evName}>
              <p className="cd-text">
                {upcoming.days === 0
                  ? t('cal.todayIs', { e: evName })
                  : upcoming.days === 1
                    ? t('cal.dayUntil', { e: evName })
                    : t('cal.daysUntil', { n: upcoming.days, e: evName })}
              </p>
            </section>
          )}

          {ramadanActive(s, today) && <RamadanCard />}
        </div>
      </div>
    </div>
  );
}
