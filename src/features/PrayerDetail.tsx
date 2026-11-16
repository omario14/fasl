import { useState } from 'react';
import { playAdhan } from '../core/audio';
import { PRAYER_AR, PRAYER_COLOR, PRAYER_LATIN, VOICES } from '../core/config';
import { computeDay } from '../core/prayer';
import { href } from '../core/router';
import { useApp } from '../core/store';
import type { PrayerId, PrayerNotify, SoundMode } from '../core/types';
import { useI18n } from '../i18n';
import type { Key } from '../i18n/en';
import { BackLink, Row, Seg, ToggleRow } from '../ui/controls';
import { ICheck, IChevron, IPlay } from '../ui/Icons';
import { toast } from '../ui/toast';
import { WINDOW_AR, WINDOW_COLOR } from '../ui/Ring';

export function PrayerDetail({ id }: { id: PrayerId }) {
  const { s, set, today, pos, isPrayed, togglePrayed } = useApp();
  const i = useI18n();
  const { t, time, dur } = i;
  const [alertsOpen, setAlertsOpen] = useState(false);

  // The span the user is living in: the active one if it matches, else today's.
  const span = pos.active?.id === id ? pos.active : computeDay(s, today).spans.find((x) => x.id === id)!;
  const total = span.end.getTime() - span.adhan.getTime();
  const now = pos.now.getTime();
  const inSpan = now >= span.adhan.getTime() && now < span.end.getTime();
  const nowFrac = (now - span.adhan.getTime()) / total;
  const color = PRAYER_COLOR[id];
  const pn = s.notify.perPrayer[id];
  const setPn = (patch: Partial<PrayerNotify>) =>
    set((x) => ({ notify: { ...x.notify, perPrayer: { ...x.notify.perPrayer, [id]: { ...x.notify.perPrayer[id], ...patch } } } }));
  const offset = s.offsets[id];
  const endsTomorrow = span.end.getDate() !== span.adhan.getDate();
  const prayed = isPrayed(span);

  return (
    <div className="page detail" style={{ ['--chapter' as string]: color }}>
      <BackLink to={href('/')} label={t('nav.today')} />
      <header className="detail-head">
        <div>
          <h1 className="detail-name ar" lang="ar">
            {PRAYER_AR[id]}
          </h1>
          <p className="chapter-latin">{PRAYER_LATIN[id]}</p>
        </div>
        <dl className="detail-times">
          <div>
            <dt className="caps">{t('detail.adhan')}</dt>
            <dd className="num">{time(span.adhan)}</dd>
          </div>
          <div>
            <dt className="caps">{t('detail.endTime')}</dt>
            <dd className="num">
              {time(span.end)}
              {endsTomorrow && <small> · {t('detail.tomorrow')}</small>}
            </dd>
          </div>
        </dl>
      </header>

      {/* Proportional timeline of the windows with a gold "now" dot */}
      <section className="timeline card" aria-label={t('detail.windows')}>
        <div className="tl-bar">
          {span.windows.map((w, k) => (
            <span
              key={k}
              className="tl-seg"
              style={{ flexGrow: w.end.getTime() - w.start.getTime(), background: WINDOW_COLOR[w.kind] }}
              title={t(`win.${w.kind}` as Key)}
            />
          ))}
          {inSpan && <span className="tl-now" style={{ insetInlineStart: `${nowFrac * 100}%` }} aria-label={t('detail.now')} />}
        </div>
        <div className="tl-ticks num">
          <span>{time(span.adhan)}</span>
          <span>{time(span.end)}</span>
        </div>
      </section>

      <section className="section" aria-labelledby="windows-title">
        <h2 id="windows-title" className="section-title" style={{ marginBottom: 12 }}>
          {t('detail.windows')}
        </h2>
        <ol className="wlist">
          {span.windows.map((w, k) => {
            const current = now >= w.start.getTime() && now < w.end.getTime();
            return (
              <li key={k} className={`wrow card ${current ? 'current' : ''}`} style={{ ['--w' as string]: WINDOW_COLOR[w.kind] }}>
                <span className="wrow-swatch" aria-hidden />
                <div className="wrow-main">
                  <p className="wrow-name">
                    <span className="ar" lang="ar">
                      {WINDOW_AR[w.kind]}
                    </span>
                    {s.lang !== 'ar' && <span> · {t(`win.${w.kind}` as Key)}</span>}
                    {current && <span className="now-pill">{t('detail.now')}</span>}
                  </p>
                  <p className="wrow-desc">{t(`desc.${w.kind}` as Key)}</p>
                </div>
                <div className="wrow-time num">
                  <b>
                    {time(w.start)} – {time(w.end)}
                  </b>
                  <span>{dur(w.end.getTime() - w.start.getTime())}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {inSpan && (
        <div className="detail-cta">
          <button className={`btn ${prayed ? 'btn-ghost' : 'btn-primary'}`} onClick={() => togglePrayed(span)} aria-pressed={prayed}>
            <ICheck />
            {prayed ? t('dash.prayed') : t('dash.markPrayed', { p: s.lang === 'ar' ? PRAYER_AR[id] : PRAYER_LATIN[id] })}
          </button>
        </div>
      )}

      <section className="section">
        <div className="group">
          <button className="row" aria-expanded={alertsOpen} onClick={() => setAlertsOpen((v) => !v)}>
            <div className="row-main">
              <div className="row-title">{t('detail.alerts')}</div>
              <div className="row-sub">
                {pn.on ? t(`snd.${pn.sound}` as Key) : t('off')}
              </div>
            </div>
            <IChevron className="chev" style={{ transform: alertsOpen ? 'rotate(90deg)' : undefined, transition: 'transform 300ms var(--ease)' }} />
          </button>
          {alertsOpen && (
            <>
              <ToggleRow title={t('set.master')} checked={pn.on} onChange={(v) => setPn({ on: v })} />
              <div className="row row-stack">
                <div className="row-title">{t('set.sound')}</div>
                <Seg<SoundMode>
                  label={t('set.sound')}
                  value={pn.sound}
                  onChange={(v) => setPn({ sound: v })}
                  options={(['off', 'chime', 'adhan', 'iqama'] as SoundMode[]).map((v) => ({ v, label: t(`snd.${v}` as Key) }))}
                />
              </div>
              {(pn.sound === 'adhan' || pn.sound === 'iqama') && (
                <Row title={t('set.voice')} htmlFor={`voice-${id}`}>
                  <select id={`voice-${id}`} className="field" style={{ maxWidth: 240 }} value={pn.voice} onChange={(e) => setPn({ voice: e.target.value as PrayerNotify['voice'] })}>
                    {VOICES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </Row>
              )}
              <ToggleRow title={t('set.alertPref')} checked={pn.preferredEnd} onChange={(v) => setPn({ preferredEnd: v })} />
              <ToggleRow title={t('set.alertObl')} checked={pn.obligation} onChange={(v) => setPn({ obligation: v })} />
              <ToggleRow title={t('set.alertMak')} checked={pn.makrooh} onChange={(v) => setPn({ makrooh: v })} />
              <Row title={t('set.test')}>
                <button
                  className="btn btn-ghost"
                  onClick={async () => {
                    const ok = await playAdhan({ voice: pn.voice, mode: pn.sound === 'off' ? 'chime' : pn.sound, prayer: id, volume: s.notify.volume, ramp: false, fajrVariant: s.notify.fajrVariant });
                    if (!ok) toast(t('set.audioMissing'));
                  }}
                >
                  <IPlay />
                  {t('set.test')}
                </button>
              </Row>
            </>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="offset-title">
        <div className="group">
          <div className="row row-stack">
            <div className="section-head" style={{ margin: 0 }}>
              <label id="offset-title" className="row-title" htmlFor={`off-${id}`}>
                {t('detail.offset')}
              </label>
              <span className="offset-val num">
                {offset > 0 ? '+' : ''}
                {i.digits(offset)} {t('min')}
              </span>
            </div>
            <p className="row-sub">{t('detail.offsetHint')}</p>
            <input
              id={`off-${id}`}
              type="range"
              min={-30}
              max={30}
              step={1}
              value={offset}
              onChange={(e) => set((x) => ({ offsets: { ...x.offsets, [id]: Number(e.target.value) } }))}
            />
            <div className="offset-scale num" aria-hidden>
              <span>−30</span>
              <span>0</span>
              <span>+30</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
