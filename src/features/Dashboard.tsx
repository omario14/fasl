import { Coordinates, Qibla } from 'adhan';
import { useMemo } from 'react';
import { ramadanActive } from '../core/alerts';
import { PRAYER_AR, PRAYER_COLOR, PRAYER_LATIN } from '../core/config';
import { HIJRI_MONTHS, nextEvent, toHijri } from '../core/hijri';
import { computeDay } from '../core/prayer';
import { href } from '../core/router';
import { useApp } from '../core/store';
import { dayOfYear, keyOf, MIN } from '../core/time';
import { PRAYERS, type PrayerId } from '../core/types';
import { HADITH } from '../data/hadith';
import { useI18n } from '../i18n';
import type { Key } from '../i18n/en';
import { IArch, IBeads, ICheck, IChevron, ICompass, IFlower, IMoon, IPin, ISun } from '../ui/Icons';
import { LanguageButton } from '../ui/LanguageButton';
import { Ring, WINDOW_COLOR } from '../ui/Ring';
import { RamadanCard } from './Ramadan';
import { RingCard } from './RingCard';

export function Dashboard() {
  const { s, today } = useApp();
  const i = useI18n();
  const { t, time } = i;
  const day = computeDay(s, today);
  const h = toHijri(today, s.hijriOffset);
  const showRamadan = ramadanActive(s, today);
  const gregStr = i.gregDate(today.y, today.m, today.d, { weekday: 'long', day: 'numeric', month: 'long' });
  const hijriStr = `${i.digits(h.d)} ${HIJRI_MONTHS[s.lang][h.m - 1]} ${i.digits(h.y)}`;

  return (
    <div className="page dash">
      <header className="dash-head">
        <div>
          <p className="caps dash-loc">
            <IPin aria-hidden />
            {s.lang === 'ar' && s.location.nameAr ? s.location.nameAr : s.location.name}
          </p>
          <h1 className="page-title">{s.datePrimary === 'hijri' ? hijriStr : gregStr}</h1>
          <p className="page-sub">{s.datePrimary === 'hijri' ? gregStr : hijriStr}</p>
        </div>
        <div className="dash-head-actions">
          <LanguageButton />
        </div>
      </header>

      <div className="dash-grid">
        <ChapterCard />
        <div className="dash-side">
          <PrayerRow />
          <RingCard />
          <Tiles />
          <section className="section sun-strip card" aria-label={t('dash.sunrise')}>
            <div>
              <ISun />
              <span className="caps">{t('dash.sunrise')}</span>
              <b className="num">{time(day.sunrise)}</b>
            </div>
            <div>
              <IMoon />
              <span className="caps">{t('dash.midnight')}</span>
              <b className="num">{time(day.midnight)}</b>
            </div>
            <div>
              <IMoon style={{ opacity: 0.6 }} />
              <span className="caps">{t('dash.lastThird')}</span>
              <b className="num">{time(day.lastThird)}</b>
            </div>
          </section>
          {showRamadan && <RamadanCard />}
          <AdhkarNudge />
          <HadithCard />
        </div>
      </div>
    </div>
  );
}

function ChapterCard() {
  const { pos, s, today, togglePrayed } = useApp();
  const i = useI18n();
  const { t, time, dur } = i;
  const h = toHijri(today, s.hijriOffset);
  const day = computeDay(s, today);
  const now = pos.now;
  const active = pos.active;

  const id: PrayerId = active ? active.id : pos.next.id;
  const color = PRAYER_COLOR[id];
  const urgencyColor = `var(--u-${pos.urgency})`;

  let progress: number;
  let center: { cap: string; big: string; sub?: string };
  let below: string;
  let windows = active?.windows;
  let start = active?.adhan;
  let end = active?.end;

  if (active) {
    progress = (now.getTime() - active.adhan.getTime()) / (active.end.getTime() - active.adhan.getTime());
    const w = pos.window ?? active.windows[active.windows.length - 1];
    const left = w.end.getTime() - now.getTime();
    if (pos.prayed) {
      center = { cap: t('dash.prayed'), big: dur(pos.next.adhan.getTime() - now.getTime()), sub: t('dash.until', { p: PRAYER_AR[pos.next.id] }) };
    } else {
      center = { cap: t('dash.leftIn', { w: t(`win.${w.kind}` as Key) }), big: left < 10 * MIN ? i.countdown(left) : dur(left) };
    }
    below = t('dash.endsAt', { w: t(`win.${w.kind}` as Key), t: time(w.end) });
  } else {
    // Between Fajr's end (sunrise) and Dhuhr — the forenoon.
    start = pos.prev.end;
    end = pos.next.adhan;
    windows = undefined;
    progress = (now.getTime() - start.getTime()) / (end.getTime() - start.getTime());
    const left = end.getTime() - now.getTime();
    center = { cap: t('dash.until', { p: PRAYER_AR[id] }), big: left < 10 * MIN ? i.countdown(left) : dur(left) };
    below = now < day.ishraq && now >= day.sunrise ? t('dash.shuruq') : t('dash.duha');
  }

  const hijriAr = `${i.digits(h.d)} ${HIJRI_MONTHS.ar[h.m - 1]} ${i.digits(h.y)}`;

  return (
    <section
      className="chapter card"
      style={{ ['--chapter' as string]: color, ['--state' as string]: urgencyColor }}
      aria-labelledby="chapter-name"
    >
      <svg className="chapter-arch" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0 120V70C0 40 120 6 200 0c80 6 200 40 200 70v50" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M40 120V80c0-26 90-52 160-58 70 6 160 32 160 58v40" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" />
      </svg>
      <div className="chapter-top">
        <div>
          <p className="caps">{active ? <span dir="ltr">{i.digits(PRAYERS.indexOf(id) + 1)} / {i.digits(5)}</span> : t('dash.between')}</p>
          <h2 id="chapter-name" className="chapter-name ar" lang="ar">
            {PRAYER_AR[id]}
          </h2>
          <p className="chapter-latin">{PRAYER_LATIN[id]}</p>
        </div>
        <p className="chapter-hijri ar" lang="ar">
          {hijriAr}
        </p>
      </div>

      <div className="chapter-ring">
        <Ring
          size={260}
          progress={Math.min(1, Math.max(0, progress))}
          color={active && !pos.prayed ? urgencyColor : color}
          windows={windows}
          start={start}
          end={end}
          label={`${PRAYER_LATIN[id]} · ${below}`}
        >
          <span className="ring-cap">{center.cap}</span>
          <span className="ring-big num">{center.big}</span>
          {center.sub && <span className="ring-sub ar" lang="ar">{center.sub}</span>}
        </Ring>
      </div>
      <p className="chapter-window">
        {pos.window && active && !pos.prayed && <span className="dot" style={{ background: WINDOW_COLOR[pos.window.kind] }} aria-hidden />}
        {below}
      </p>

      <div className="chapter-actions">
        {active ? (
          <button
            className={`btn ${pos.prayed ? 'btn-ghost' : 'btn-primary'}`}
            onClick={() => togglePrayed(active)}
            aria-pressed={pos.prayed}
          >
            <ICheck />
            {pos.prayed ? t('dash.prayed') : t('dash.markPrayed', { p: s.lang === 'ar' ? PRAYER_AR[id] : PRAYER_LATIN[id] })}
          </button>
        ) : (
          <span className="chapter-next num">
            {PRAYER_LATIN[id]} · {time(pos.next.adhan)}
          </span>
        )}
        <a className="btn btn-quiet" href={href(`/prayer/${id}`)}>
          {t('detail.windows')}
          <IChevron className="flip" />
        </a>
      </div>
    </section>
  );
}

function PrayerRow() {
  const { s, today, pos, isPrayed } = useApp();
  const { t, time } = useI18n();
  const day = computeDay(s, today);
  // After midnight, "today's" Isha is still yesterday's span — show the active one.
  const spans = day.spans.map((sp) => (pos.active && pos.active.id === sp.id && pos.active.dayKey !== sp.dayKey ? pos.active : sp));
  return (
    <section className="section" aria-labelledby="row-title" style={{ marginTop: 0 }}>
      <div className="section-head">
        <h2 id="row-title" className="section-title">
          {t('dash.today')}
        </h2>
      </div>
      <div className="prayer-row">
        {spans.map((sp) => {
          const isActive = pos.active?.id === sp.id && pos.active.dayKey === sp.dayKey;
          const past = sp.end.getTime() <= pos.now.getTime();
          const prayed = isPrayed(sp);
          const state = isActive ? 'active' : past ? 'past' : 'upcoming';
          return (
            <a
              key={sp.id}
              href={href(`/prayer/${sp.id}`)}
              className={`pcard card ${state}`}
              style={{ ['--chapter' as string]: PRAYER_COLOR[sp.id] }}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`${PRAYER_LATIN[sp.id]} ${time(sp.adhan)}${prayed ? ' · ' + t('dash.prayed') : ''}`}
            >
              <span className="pcard-dot" aria-hidden />
              <span className="pcard-ar ar" lang="ar">
                {PRAYER_AR[sp.id]}
              </span>
              <span className="pcard-time num">{time(sp.adhan)}</span>
              <span className="pcard-latin">{PRAYER_LATIN[sp.id]}</span>
              {prayed && (
                <span className="pcard-check" aria-hidden>
                  <ICheck />
                </span>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}

function Tiles() {
  const { s, today, data, pos } = useApp();
  const { t } = useI18n();
  const bearing = useMemo(() => Math.round(Qibla(new Coordinates(s.location.lat, s.location.lng))), [s.location.lat, s.location.lng]);
  const ev = useMemo(() => nextEvent(today, s.hijriOffset), [today, s.hijriOffset]);
  const day = computeDay(s, today);
  const evening = pos.now >= day.dhuhr;
  const evName = ev ? t(`ev.${ev.event.id}` as Key) : '';
  const evBadge = !ev ? '' : ev.days === 0 ? t('dash.isToday', { e: evName }) : ev.days === 1 ? t('dash.dayTo', { e: evName }) : t('dash.daysTo', { n: ev.days, e: evName });
  const tiles = [
    { to: '/qibla', icon: ICompass, label: t('nav.qibla'), badge: t('dash.qiblaBadge', { deg: bearing }), tone: '#3A6EA8' },
    { to: evening ? '/duaa/evening' : '/duaa/morning', icon: IFlower, label: t('duaa.title'), badge: evening ? t('dash.duaaBadgeEve') : t('dash.duaaBadge'), tone: '#B85C3A' },
    { to: '/tasbih', icon: IBeads, label: t('nav.tasbih'), badge: t('dash.tasbihBadge', { n: data.tasbih[keyOf(today)] ?? 0 }), tone: '#C9A84C' },
    { to: '/calendar', icon: IArch, label: t('nav.calendar'), badge: evBadge, tone: '#1D6B5E' },
  ];
  return (
    <section className="section tiles" aria-label={t('nav.more')}>
      {tiles.map((x) => (
        <a key={x.to} href={href(x.to)} className="tile card" style={{ ['--tone' as string]: x.tone }}>
          <span className="tile-icon">
            <x.icon />
          </span>
          <span className="tile-label">{x.label}</span>
          {x.badge && <span className="tile-badge">{x.badge}</span>}
        </a>
      ))}
    </section>
  );
}

function AdhkarNudge() {
  const { s, today, pos } = useApp();
  const { t } = useI18n();
  const day = computeDay(s, today);
  const n = pos.now.getTime();
  const mStart = day.fajr.getTime() + s.adhkar.morningOffset * MIN;
  const eStart = day.maghrib.getTime() - s.adhkar.eveningOffset * MIN;
  const morning = s.adhkar.morning && n >= mStart && n < day.dhuhr.getTime();
  const evening = s.adhkar.evening && n >= eStart && n < day.isha.getTime();
  if (!morning && !evening) return null;
  return (
    <a className="nudge card" href={href(morning ? '/duaa/morning' : '/duaa/evening')} style={{ ['--tone' as string]: morning ? '#3A6EA8' : '#B85C3A' }}>
      {morning ? <ISun /> : <IMoon />}
      <span>
        <b>{morning ? t('dash.adhkarDue') : t('dash.adhkarDueEve')}</b>
        <span className="muted">{t('dash.readNow')}</span>
      </span>
      <IChevron className="flip" />
    </a>
  );
}

function HadithCard() {
  const { s, today } = useApp();
  const { t } = useI18n();
  const hd = HADITH[(dayOfYear(today) + today.y) % HADITH.length];
  const tr = s.lang === 'fr' ? hd.fr : hd.en;
  return (
    <section className="section hadith card" aria-labelledby="hadith-title">
      <h2 id="hadith-title" className="section-title">
        {t('dash.hadith')}
      </h2>
      <p className="hadith-ar ar" lang="ar">
        {hd.ar}
      </p>
      {s.lang !== 'ar' && <p className="hadith-tr">{tr}</p>}
      <p className="hadith-src caps">
        {hd.narrator} · {hd.src}
      </p>
    </section>
  );
}

