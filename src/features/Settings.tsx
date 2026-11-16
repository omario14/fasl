import { useEffect, useState, type ReactNode } from 'react';
import { chime } from '../core/audio';
import { asrForMadhab, METHODS, PRAYER_AR, PRAYER_LATIN, VOICES } from '../core/config';
import { useApp } from '../core/store';
import { deviceTz } from '../core/time';
import { PRAYERS, type HighLatRule, type Madhab, type MethodId, type Settings as S, type SoundMode, type Theme } from '../core/types';
import { LANGS, useI18n } from '../i18n';
import type { Key } from '../i18n/en';
import { Row, Seg, Toggle, ToggleRow } from '../ui/controls';
import { IDownload } from '../ui/Icons';
import { toast } from '../ui/toast';
import { LanguageButton } from '../ui/LanguageButton';
import { LocationPicker } from './LocationPicker';
import { exactAlarmsGranted, isNative, notifyPermission, openExactAlarmSettings, requestNotifyPermission } from '../core/native';

type BIPEvent = Event & { prompt: () => Promise<void> };
let deferredInstall: BIPEvent | null = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstall = e as BIPEvent;
});

const GROUPS = ['calc', 'location', 'notifications', 'display', 'language', 'fasting', 'about'] as const;

function Group({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="set-group" id={`g-${id}`} aria-labelledby={`h-${id}`}>
      <h2 id={`h-${id}`} className="section-title group-label">
        {title}
      </h2>
      <div className="group">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const { s, set } = useApp();
  const i = useI18n();
  const { t, digits } = i;
  const [perm, setPerm] = useState(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);
  const [lat, setLat] = useState(String(s.location.lat));
  const [lng, setLng] = useState(String(s.location.lng));
  const [coordErr, setCoordErr] = useState('');
  const [canInstall, setCanInstall] = useState(!!deferredInstall);

  useEffect(() => {
    const on = () => setCanInstall(true);
    window.addEventListener('beforeinstallprompt', on);
    return () => window.removeEventListener('beforeinstallprompt', on);
  }, []);

  const nested = <K extends 'notify' | 'adhkar' | 'fasting'>(k: K, patch: Partial<S[K]>) => set((x) => ({ [k]: { ...x[k], ...patch } }) as Partial<S>);
  const groupTitle: Record<(typeof GROUPS)[number], Key> = {
    calc: 'set.calc',
    location: 'set.location',
    notifications: 'set.notifications',
    display: 'set.display',
    language: 'set.language',
    fasting: 'set.fasting',
    about: 'set.about',
  };

  return (
    <div className="page settings">
      <header className="page-head">
        <h1 className="page-title">{t('set.title')}</h1>
        <LanguageButton withLabel />
      </header>

      <nav className="set-jump" aria-label={t('set.title')}>
        {GROUPS.map((g) => (
          <a key={g} href={`#/settings`} onClick={(e) => { e.preventDefault(); document.getElementById(`g-${g}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }}>
            {t(groupTitle[g])}
          </a>
        ))}
      </nav>

      <div className="set-cols">
        <div>
          {/* ───── Calculation ───── */}
          <Group id="calc" title={t('set.calc')}>
            <Row title={t('set.method')} sub={METHODS.find((m) => m.id === s.method)?.detail} htmlFor="method">
              <select id="method" className="field set-select" value={s.method} onChange={(e) => set({ method: e.target.value as MethodId })}>
                {METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Row>
            {s.method === 'custom' && (
              <>
                <Row title={t('set.customFajr')} htmlFor="cf">
                  <input id="cf" className="field num set-num" type="number" step={0.5} min={10} max={22} value={s.customFajr} onChange={(e) => set({ customFajr: Number(e.target.value) })} />
                </Row>
                <Row title={t('set.customIsha')} htmlFor="ci">
                  <input id="ci" className="field num set-num" type="number" step={0.5} min={10} max={22} value={s.customIsha} onChange={(e) => set({ customIsha: Number(e.target.value) })} />
                </Row>
              </>
            )}
            <Row title={t('set.madhab')} htmlFor="madhab">
              <select id="madhab" className="field set-select" value={s.madhab} onChange={(e) => { const m = e.target.value as Madhab; set({ madhab: m, asr: asrForMadhab(m) }); }}>
                {(['maliki', 'hanafi', 'shafii', 'hanbali', 'jafari'] as Madhab[]).map((m) => (
                  <option key={m} value={m}>
                    {t(`mad.${m}` as Key)}
                  </option>
                ))}
              </select>
            </Row>
            <div className="row row-stack">
              <div className="row-title">{t('set.asr')}</div>
              <Seg label={t('set.asr')} value={s.asr} onChange={(v) => set({ asr: v })} options={[{ v: 'standard', label: t('set.asrStd') }, { v: 'hanafi', label: t('set.asrHanafi') }]} />
            </div>
            <Row title={t('set.highLat')} htmlFor="hl">
              <select id="hl" className="field set-select" value={s.highLat} onChange={(e) => set({ highLat: e.target.value as HighLatRule })}>
                {(['angle', 'seventh', 'middle', 'nearest'] as HighLatRule[]).map((h) => (
                  <option key={h} value={h}>
                    {t(`hl.${h}` as Key)}
                  </option>
                ))}
              </select>
            </Row>
            <div className="row row-stack">
              <div className="row-title">{t('set.offsets')}</div>
              <div className="offsets">
                {PRAYERS.map((p) => (
                  <div key={p} className="offset">
                    <label htmlFor={`o-${p}`}>
                      <span className="ar" lang="ar">{PRAYER_AR[p]}</span> <span className="muted">{PRAYER_LATIN[p]}</span>
                    </label>
                    <input id={`o-${p}`} type="range" min={-30} max={30} value={s.offsets[p]} onChange={(e) => set((x) => ({ offsets: { ...x.offsets, [p]: Number(e.target.value) } }))} />
                    <span className="num offset-val">
                      {s.offsets[p] > 0 ? '+' : ''}
                      {digits(s.offsets[p])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Row title={t('set.hijriOffset')}>
              <Seg<number> label={t('set.hijriOffset')} value={s.hijriOffset} onChange={(v) => set({ hijriOffset: v })} options={[-2, -1, 0, 1, 2].map((v) => ({ v, label: (v > 0 ? '+' : '') + digits(v) }))} />
            </Row>
          </Group>

          {/* ───── Location ───── */}
          <Group id="location" title={t('set.location')}>
            <div className="row row-stack">
              <div className="row-title">{s.lang === 'ar' && s.location.nameAr ? s.location.nameAr : s.location.name}</div>
              <div className="row-sub num">
                {s.location.lat.toFixed(4)}, {s.location.lng.toFixed(4)} · {s.location.tz}
              </div>
              <LocationPicker
                compact
                onPick={(p) => {
                  set({ location: p });
                  setLat(String(p.lat));
                  setLng(String(p.lng));
                }}
              />
            </div>
            <div className="row row-stack">
              <div className="row-title">{t('set.coords')}</div>
              <form
                className="coords"
                onSubmit={(e) => {
                  e.preventDefault();
                  const la = Number(lat);
                  const lo = Number(lng);
                  if (!Number.isFinite(la) || !Number.isFinite(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180) {
                    setCoordErr(`${t('set.lat')} −90…90 · ${t('set.lng')} −180…180`);
                    return;
                  }
                  setCoordErr('');
                  set({ location: { mode: 'manual', lat: la, lng: lo, name: `${la.toFixed(3)}, ${lo.toFixed(3)}`, tz: s.location.tz, country: undefined } });
                }}
              >
                <div>
                  <label htmlFor="lat" className="caps">{t('set.lat')}</label>
                  <input id="lat" className="field num" inputMode="decimal" value={lat} onChange={(e) => setLat(e.target.value)} aria-invalid={!!coordErr} />
                </div>
                <div>
                  <label htmlFor="lng" className="caps">{t('set.lng')}</label>
                  <input id="lng" className="field num" inputMode="decimal" value={lng} onChange={(e) => setLng(e.target.value)} aria-invalid={!!coordErr} />
                </div>
                <button className="btn btn-ghost" type="submit">
                  {t('set.applyCoords')}
                </button>
              </form>
              {coordErr && <p className="form-err" role="alert">{coordErr}</p>}
            </div>
            <div className="row row-stack">
              <div className="row-title">{t('set.tz')}</div>
              <Seg label={t('set.tz')} value={s.tzMode} onChange={(v) => set({ tzMode: v })} options={[{ v: 'auto', label: `${t('set.tzAuto')} · ${deviceTz()}` }, { v: 'manual', label: t('set.tzManual') }]} />
              {s.tzMode === 'manual' && (
                <>
                  <label className="sr-only" htmlFor="tz">{t('set.tz')}</label>
                  <select id="tz" className="field" value={s.location.tz} onChange={(e) => set((x) => ({ location: { ...x.location, tz: e.target.value } }))}>
                    {(Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.('timeZone').map((z) => (
                      <option key={z} value={z}>{z}</option>
                    )) ?? <option value={s.location.tz}>{s.location.tz}</option>}
                  </select>
                </>
              )}
            </div>
            <Row title={t('set.elevation')} htmlFor="elev">
              <input id="elev" className="field num set-num" type="number" value={s.location.elevation ?? 0} onChange={(e) => set((x) => ({ location: { ...x.location, elevation: Number(e.target.value) } }))} />
            </Row>
          </Group>

          {/* ───── Fasting ───── */}
          <Group id="fasting" title={t('set.fasting')}>
            <div className="row row-stack">
              <div className="row-title">{t('set.ramadanMode')}</div>
              <Seg label={t('set.ramadanMode')} value={s.fasting.ramadanMode} onChange={(v) => nested('fasting', { ramadanMode: v })} options={[{ v: 'auto', label: t('rm.auto') }, { v: 'on', label: t('on') }, { v: 'off', label: t('off') }]} />
            </div>
            <div className="row row-stack">
              <div className="row-title">{t('set.suhoor')}</div>
              <Seg<number> label={t('set.suhoor')} value={s.fasting.suhoorBefore} onChange={(v) => nested('fasting', { suhoorBefore: v })} options={[10, 15, 20, 30].map((v) => ({ v, label: `${digits(v)} ${t('min')}` }))} />
            </div>
            <div className="row row-stack">
              <div className="row-title">{t('set.iftar')}</div>
              <Seg
                label={t('set.iftar')}
                value={s.fasting.iftarMode === 'adhan' ? 0 : s.fasting.iftarBefore}
                onChange={(v) => nested('fasting', v === 0 ? { iftarMode: 'adhan' } : { iftarMode: 'before', iftarBefore: v })}
                options={[{ v: 0, label: t('set.iftarAdhan') }, ...[5, 10, 15].map((v) => ({ v, label: t('set.iftarBefore', { n: v }) }))]}
              />
            </div>
            <ToggleRow title={t('set.tarawih')} checked={s.fasting.tarawih} onChange={(v) => nested('fasting', { tarawih: v })} />
            <ToggleRow title={t('set.sunnahFasts')} checked={s.fasting.sunnahFasts} onChange={(v) => nested('fasting', { sunnahFasts: v })} />
          </Group>
        </div>

        <div>
          {/* ───── Notifications ───── */}
          <Group id="notifications" title={t('set.notifications')}>
            <ToggleRow title={t('set.master')} checked={s.notify.master} onChange={(v) => nested('notify', { master: v })} />
            {isNative ? (
              <NativeNotifyRows />
            ) : (
              <>
                <Row title={t('set.permission')} sub={perm === 'granted' ? t('set.permGranted') : perm === 'denied' ? t('set.permDenied') : undefined}>
                  {perm !== 'granted' && perm !== 'unsupported' && (
                    <button className="btn btn-ghost" disabled={perm === 'denied'} onClick={async () => setPerm(await Notification.requestPermission())}>
                      {t('set.allow')}
                    </button>
                  )}
                </Row>
              </>
            )}
            <ToggleRow title={t('set.statusBar')} checked={s.notify.statusBar} onChange={(v) => nested('notify', { statusBar: v })} />
            {!isNative && <ToggleRow title={t('set.systemPin')} checked={s.notify.systemPin} onChange={(v) => nested('notify', { systemPin: v })} />}
            <ToggleRow title={t('set.vibration')} checked={s.notify.vibration} onChange={(v) => nested('notify', { vibration: v })} />
            <div className="row row-stack">
              <div className="section-head" style={{ margin: 0 }}>
                <label className="row-title" htmlFor="vol">{t('set.volume')}</label>
                <span className="num muted">{digits(Math.round(s.notify.volume * 100))}%</span>
              </div>
              <input id="vol" type="range" min={0} max={1} step={0.05} value={s.notify.volume} onChange={(e) => nested('notify', { volume: Number(e.target.value) })} onPointerUp={() => chime(s.notify.volume, true)} />
            </div>
            <ToggleRow title={t('set.ramp')} checked={s.notify.ramp} onChange={(v) => nested('notify', { ramp: v })} />
            <ToggleRow title={t('set.fajrVariant')} checked={s.notify.fajrVariant} onChange={(v) => nested('notify', { fajrVariant: v })} />
            <ToggleRow title={t('set.duaAfter')} checked={s.notify.duaAfterAdhan} onChange={(v) => nested('notify', { duaAfterAdhan: v })} />
            {PRAYERS.map((p) => {
              const pn = s.notify.perPrayer[p];
              const setPn = (patch: Partial<typeof pn>) => set((x) => ({ notify: { ...x.notify, perPrayer: { ...x.notify.perPrayer, [p]: { ...x.notify.perPrayer[p], ...patch } } } }));
              return (
                <details key={p} className="row row-stack per-prayer">
                  <summary>
                    <span className="row-title">
                      <span className="ar" lang="ar">{PRAYER_AR[p]}</span> <span className="muted">{PRAYER_LATIN[p]}</span>
                    </span>
                    <span className="row-sub">{pn.on ? t(`snd.${pn.sound}` as Key) : t('off')}</span>
                  </summary>
                  <div className="pp-body">
                    <div className="pp-line">
                      <span>{t('set.master')}</span>
                      <Toggle checked={pn.on} onChange={(v) => setPn({ on: v })} label={`${t('set.master')} · ${PRAYER_LATIN[p]}`} />
                    </div>
                    <Seg<SoundMode> label={t('set.sound')} value={pn.sound} onChange={(v) => setPn({ sound: v })} options={(['off', 'chime', 'adhan', 'iqama'] as SoundMode[]).map((v) => ({ v, label: t(`snd.${v}` as Key) }))} />
                    <label className="sr-only" htmlFor={`v-${p}`}>{t('set.voice')}</label>
                    <select id={`v-${p}`} className="field" value={pn.voice} onChange={(e) => setPn({ voice: e.target.value as typeof pn.voice })} disabled={pn.sound !== 'adhan' && pn.sound !== 'iqama'}>
                      {VOICES.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                    {([['preferredEnd', 'set.alertPref'], ['obligation', 'set.alertObl'], ['makrooh', 'set.alertMak']] as const).map(([k, key]) => (
                      <div key={k} className="pp-line">
                        <span>{t(key)}</span>
                        <Toggle checked={pn[k]} onChange={(v) => setPn({ [k]: v })} label={`${t(key)} · ${PRAYER_LATIN[p]}`} />
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
            <div className="row">
              <p className="row-sub">{t('set.audioNote')}</p>
            </div>
          </Group>

          <Group id="adhkar" title={t('set.adhkar')}>
            <div className="row row-stack">
              <div className="pp-line">
                <span className="row-title">{t('set.morning')}</span>
                <Toggle checked={s.adhkar.morning} onChange={(v) => nested('adhkar', { morning: v })} label={t('set.morning')} />
              </div>
              <Seg<number> label={t('set.morning')} value={s.adhkar.morningOffset} onChange={(v) => nested('adhkar', { morningOffset: v })} options={[15, 30, 45, 60].map((v) => ({ v, label: `${digits(v)} ${t('min')}` }))} />
            </div>
            <div className="row row-stack">
              <div className="pp-line">
                <span className="row-title">{t('set.evening')}</span>
                <Toggle checked={s.adhkar.evening} onChange={(v) => nested('adhkar', { evening: v })} label={t('set.evening')} />
              </div>
              <Seg<number> label={t('set.evening')} value={s.adhkar.eveningOffset} onChange={(v) => nested('adhkar', { eveningOffset: v })} options={[15, 30, 45, 60].map((v) => ({ v, label: `${digits(v)} ${t('min')}` }))} />
            </div>
          </Group>

          {/* ───── Display ───── */}
          <Group id="display" title={t('set.display')}>
            <div className="row row-stack">
              <div className="row-title">{t('set.theme')}</div>
              <Seg<Theme> label={t('set.theme')} value={s.theme} onChange={(v) => set({ theme: v })} options={(['dark', 'light', 'auto'] as Theme[]).map((v) => ({ v, label: t(`theme.${v}` as Key) }))} />
            </div>
            <Row title={t('set.clock')}>
              <Seg label={t('set.clock')} value={s.clock} onChange={(v) => set({ clock: v })} options={[{ v: '24', label: t('set.clock24') }, { v: '12', label: t('set.clock12') }]} />
            </Row>
            <Row title={t('set.datePrimary')}>
              <Seg label={t('set.datePrimary')} value={s.datePrimary} onChange={(v) => set({ datePrimary: v })} options={[{ v: 'hijri', label: t('set.hijri') }, { v: 'greg', label: t('set.greg') }]} />
            </Row>
          </Group>

          {/* ───── Language ───── */}
          <Group id="language" title={t('set.language')}>
            <div className="row row-stack">
              <div className="row-title">{t('set.appLang')}</div>
              <div className="seg" role="group" aria-label={t('set.appLang')}>
                {LANGS.map((l) => (
                  <button key={l.id} aria-pressed={s.lang === l.id} onClick={() => set({ lang: l.id })} lang={l.id} className={l.id === 'ar' ? 'ar-btn' : undefined}>
                    {l.native}
                  </button>
                ))}
              </div>
            </div>
            <div className="row row-stack">
              <div className="row-title">{t('set.numerals')}</div>
              <Seg label={t('set.numerals')} value={s.numerals} onChange={(v) => set({ numerals: v })} options={[{ v: 'auto', label: t('num.auto') }, { v: 'arab', label: t('num.arab') }, { v: 'latn', label: t('num.latn') }]} />
            </div>
            <div className="row row-stack">
              <div className="row-title">{t('set.qiblaMethod')}</div>
              <Seg label={t('set.qiblaMethod')} value={s.qibla} onChange={(v) => set({ qibla: v })} options={[{ v: 'geographic', label: t('qm.geographic') }, { v: 'magnetic', label: t('qm.magnetic') }]} />
            </div>
          </Group>

          {/* ───── About ───── */}
          <Group id="about" title={t('set.about')}>
            <div className="row row-stack about">
              <p className="row-title">
                Fasl · <span className="ar" lang="ar">فَصْل</span> — {t('tagline')}
              </p>
              <p className="row-sub">{t('set.version', { v: '1.0.0' })}</p>
              <p className="row-sub">{t('set.privacy')}</p>
            </div>
            {canInstall && (
              <Row title={t('set.install')}>
                <button
                  className="btn btn-ghost"
                  onClick={async () => {
                    await deferredInstall?.prompt();
                    deferredInstall = null;
                    setCanInstall(false);
                  }}
                >
                  <IDownload />
                  {t('install')}
                </button>
              </Row>
            )}
            <Row title={t('set.rerun')}>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  set({ onboarded: false });
                  toast(t('ob.begin'));
                }}
              >
                {t('ob.begin')}
              </button>
            </Row>
          </Group>
        </div>
      </div>
    </div>
  );
}

/** Installed app: Android notification permission and exact-alarm access (alerts on the minute). */
function NativeNotifyRows() {
  const { t } = useI18n();
  const [perm, setPerm] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [exact, setExact] = useState(true);
  useEffect(() => {
    const check = () => {
      void notifyPermission().then(setPerm);
      void exactAlarmsGranted().then(setExact);
    };
    check();
    document.addEventListener('visibilitychange', check);
    return () => document.removeEventListener('visibilitychange', check);
  }, []);
  return (
    <>
      <Row title={t('set.permission')} sub={perm === 'granted' ? t('set.permGranted') : perm === 'denied' ? t('set.permDenied') : undefined}>
        {perm !== 'granted' && (
          <button className="btn btn-ghost" onClick={async () => setPerm((await requestNotifyPermission()) ? 'granted' : 'denied')}>
            {t('set.allow')}
          </button>
        )}
      </Row>
      <Row title={t('set.exact')} sub={exact ? t('set.exactOk') : t('set.exactSub')}>
        {!exact && (
          <button className="btn btn-ghost" onClick={() => void openExactAlarmSettings()}>
            {t('set.allow')}
          </button>
        )}
      </Row>
    </>
  );
}
