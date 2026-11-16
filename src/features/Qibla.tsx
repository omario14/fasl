import { Coordinates, Qibla as qiblaBearing } from 'adhan';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MAKKAH } from '../core/config';
import { useApp } from '../core/store';
import { haversineKm } from '../data/cities';
import { useI18n } from '../i18n';
import type { Key } from '../i18n/en';
import { Sheet } from '../ui/controls';
import { ICompass, IMap, IReset } from '../ui/Icons';
import { dotIcon, greatCircle, kaabaIcon, L, useLeaflet } from './map';

type Acc = 'good' | 'fair' | 'poor' | 'none';
type Perm = 'idle' | 'on' | 'denied' | 'unsupported';

const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
const dirOf = (deg: number) => DIRS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];

/** Shortest signed difference a→b in degrees, in (-180, 180]. */
const delta = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;

/** Live device heading from the magnetometer (iOS webkitCompassHeading, Android absolute alpha). */
function useHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  const [acc, setAcc] = useState<Acc>('none');
  const [perm, setPerm] = useState<Perm>('idle');
  const samples = useRef<number[]>([]);

  const start = async () => {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined;
    if (!DOE) return setPerm('unsupported');
    if (typeof DOE.requestPermission === 'function') {
      try {
        if ((await DOE.requestPermission()) !== 'granted') return setPerm('denied');
      } catch {
        return setPerm('denied');
      }
    }
    setPerm('on');
  };

  useEffect(() => {
    if (perm !== 'on') return;
    let got = false;
    const onEvent = (e: DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number }) => {
      let h: number | null = null;
      if (typeof e.webkitCompassHeading === 'number') {
        h = e.webkitCompassHeading;
        const a = e.webkitCompassAccuracy ?? -1;
        setAcc(a < 0 ? 'poor' : a <= 15 ? 'good' : a <= 30 ? 'fair' : 'poor');
      } else if (e.absolute && typeof e.alpha === 'number') {
        const screenAngle = screen.orientation?.angle ?? 0;
        h = (360 - e.alpha + screenAngle) % 360;
        // Judge reliability by jitter over the last second of samples.
        const s = samples.current;
        s.push(h);
        if (s.length > 20) s.shift();
        if (s.length >= 8) {
          const mean = s[s.length - 1];
          const spread = Math.max(...s.map((x) => Math.abs(delta(mean, x))));
          setAcc(spread < 6 ? 'good' : spread < 18 ? 'fair' : 'poor');
        }
      }
      if (h !== null) {
        got = true;
        setHeading(h);
      }
    };
    const abs = 'ondeviceorientationabsolute' in window;
    const name = abs ? 'deviceorientationabsolute' : 'deviceorientation';
    window.addEventListener(name, onEvent as EventListener);
    const timer = setTimeout(() => !got && setPerm('unsupported'), 2500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(name, onEvent as EventListener);
    };
  }, [perm]);

  // Android and desktop need no permission prompt: start listening straight away.
  useEffect(() => {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: unknown } | undefined;
    if (DOE && typeof DOE.requestPermission !== 'function') setPerm('on');
    else if (!DOE) setPerm('unsupported');
  }, []);

  return { heading, acc, perm, start };
}

/** Damped spring (stiffness 200, damping 15) driving the dial toward its target angle. */
function useSpring(target: number) {
  const [value, setValue] = useState(target);
  const st = useRef({ x: target, v: 0, target });
  st.current.target = target;
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      st.current.x = target;
      setValue(target);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const k = 200;
    const c = 15;
    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const s = st.current;
      const diff = delta(s.x, s.target); // follow the short way round
      const a = k * diff - c * s.v;
      s.v += a * dt;
      s.x += s.v * dt;
      setValue(s.x);
      if (Math.abs(diff) > 0.05 || Math.abs(s.v) > 0.05) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

export default function QiblaPage() {
  const { s } = useApp();
  const i = useI18n();
  const { t } = i;
  const [view, setView] = useState<'compass' | 'map'>('compass');
  const [calib, setCalib] = useState(false);
  const { heading, acc, perm, start } = useHeading();
  const loc = s.location;
  const bearing = useMemo(() => qiblaBearing(new Coordinates(loc.lat, loc.lng)), [loc.lat, loc.lng]);
  const km = haversineKm(loc, MAKKAH);
  const live = heading !== null;
  const dial = useSpring(live ? -heading! : 0);
  const off = live ? delta(heading!, bearing) : null;
  const facing = off !== null && Math.abs(off) <= 3;

  return (
    <div className="page qibla">
      <header className="page-head">
        <div>
          <h1 className="page-title">{t('qibla.title')}</h1>
          <p className="page-sub">{t('qibla.toMakkah')}</p>
        </div>
        <div className="seg" role="group" aria-label={t('qibla.map')}>
          <button aria-pressed={view === 'compass'} onClick={() => setView('compass')}>
            <ICompass width={16} height={16} style={{ verticalAlign: '-3px', marginInlineEnd: 6 }} />
            {t('qibla.compass')}
          </button>
          <button aria-pressed={view === 'map'} onClick={() => setView('map')}>
            <IMap width={16} height={16} style={{ verticalAlign: '-3px', marginInlineEnd: 6 }} />
            {t('qibla.map')}
          </button>
        </div>
      </header>

      <div className="qibla-grid">
        <section className="card qibla-stage" aria-label={t('qibla.compass')}>
          {view === 'compass' ? (
            <div className={`compass ${facing ? 'facing' : ''}`}>
              <svg viewBox="0 0 320 320" className="compass-svg" role="img" aria-label={`${Math.round(bearing)}° ${t(`dir.${dirOf(bearing)}` as Key)}`}>
                <g style={{ transform: `rotate(${dial}deg)`, transformOrigin: '160px 160px' }}>
                  <circle cx="160" cy="160" r="150" className="c-face" />
                  <circle cx="160" cy="160" r="118" className="c-inner" />
                  {Array.from({ length: 72 }, (_, k) => {
                    const major = k % 9 === 0;
                    const a = (k * 5 * Math.PI) / 180;
                    const r1 = 150 - (major ? 14 : 7);
                    return (
                      <line
                        key={k}
                        x1={160 + Math.sin(a) * 146}
                        y1={160 - Math.cos(a) * 146}
                        x2={160 + Math.sin(a) * r1}
                        y2={160 - Math.cos(a) * r1}
                        className={major ? 'c-tick major' : 'c-tick'}
                      />
                    );
                  })}
                  {(['N', 'E', 'S', 'W'] as const).map((d, k) => {
                    const a = (k * 90 * Math.PI) / 180;
                    return (
                      <text key={d} x={160 + Math.sin(a) * 122} y={160 - Math.cos(a) * 122 + 6} className={d === 'N' ? 'c-card north' : 'c-card'} textAnchor="middle">
                        {t(`dir.${d}` as Key)}
                      </text>
                    );
                  })}
                  {/* zellige star at the centre */}
                  <path d="M160 112l13 31 31 13-31 13-13 31-13-31-31-13 31-13z" className="c-star" />
                  <path d="M126 126h68v68h-68z" transform="rotate(45 160 160)" className="c-star" />
                  {/* Qibla needle */}
                  <g style={{ transform: `rotate(${bearing}deg)`, transformOrigin: '160px 160px' }}>
                    <path d="M160 34l9 112h-18z" className="c-needle" />
                    <path d="M160 286l6-112h-12z" className="c-tail" />
                    <rect x="150" y="18" width="20" height="20" rx="2" className="c-kaaba" />
                    <rect x="150" y="22" width="20" height="3" className="c-kiswa" />
                  </g>
                  <circle cx="160" cy="160" r="7" className="c-hub" />
                </g>
                {live && <path d="M160 2l7 12h-14z" className="c-lubber" />}
              </svg>
            </div>
          ) : (
            <QiblaMap />
          )}
        </section>

        <aside className="qibla-info">
          <div className="card qibla-readout">
            <p className="qibla-deg num">
              {i.digits(Math.round(bearing))}° <span>{t(`dir.${dirOf(bearing)}` as Key)}</span>
            </p>
            <p className="muted num">{t('qibla.distance', { km: i.num(Math.round(km)), mi: i.num(Math.round(km * 0.621371)) })}</p>
            {live && (
              <p className={`qibla-turn ${facing ? 'ok' : ''}`} aria-live="polite">
                {facing
                  ? t('qibla.facing')
                  : off! > 0
                    ? t('qibla.turnRight', { deg: Math.round(Math.abs(off!)) })
                    : t('qibla.turnLeft', { deg: Math.round(Math.abs(off!)) })}
              </p>
            )}
          </div>

          <div className="card qibla-sensor">
            <div className={`acc acc-${acc}`} aria-hidden>
              <span />
            </div>
            <div>
              <p className="caps">{t('qibla.accuracy')}</p>
              <p className="row-title">{t(`acc.${acc}` as Key)}</p>
              {live && <p className="muted num">{t('qibla.heading', { deg: Math.round(heading!) })}</p>}
            </div>
          </div>

          {perm !== 'on' && perm !== 'unsupported' && perm !== 'denied' && (
            <button className="btn btn-primary" onClick={start}>
              <ICompass />
              {t('qibla.enable')}
            </button>
          )}
          {perm === 'unsupported' && <p className="note">{t('qibla.noSensor')}</p>}
          {perm === 'denied' && <p className="note">{t('qibla.denied')}</p>}
          <button className="btn btn-ghost" onClick={() => setCalib(true)}>
            <IReset />
            {t('qibla.calibrate')}
          </button>
          <p className="caps qibla-ref">{s.qibla === 'geographic' ? t('qm.geographic') : t('qm.magnetic')}</p>
        </aside>
      </div>

      {calib && (
        <Sheet title={t('qibla.calTitle')} onClose={() => setCalib(false)} closeLabel={t('close')}>
          <div className="calib">
            <svg viewBox="0 0 240 120" className="calib-svg" aria-hidden>
              <path id="eight" d="M120 60c30-46 90-46 90 0s-60 46-90 0-90-46-90 0 60 46 90 0z" className="calib-path" />
              <g className="calib-phone">
                <rect x="-11" y="-18" width="22" height="36" rx="5" />
                <circle cx="0" cy="12" r="2" />
              </g>
            </svg>
            <p>{t('qibla.calBody')}</p>
            <button className="btn btn-primary" onClick={() => setCalib(false)}>
              {t('qibla.calDone')}
            </button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

function QiblaMap() {
  const { s } = useApp();
  const loc = s.location;
  const ref = useLeaflet(
    (map) => {
      const line = greatCircle(loc, MAKKAH);
      L.polyline(line, { color: '#C9A84C', weight: 3, opacity: 0.95 }).addTo(map);
      L.marker([loc.lat, loc.lng], { icon: dotIcon('#4FC8A0') }).addTo(map);
      L.marker([MAKKAH.lat, MAKKAH.lng], { icon: kaabaIcon() }).addTo(map);
      // Open near the user with the start of the line in view.
      const near = line.slice(0, Math.max(2, Math.round(line.length * 0.08)));
      map.fitBounds(L.latLngBounds([[loc.lat, loc.lng], ...near]), { padding: [40, 40], maxZoom: 13 });
    },
    [loc.lat, loc.lng],
  );
  return <div ref={ref} className="map qibla-map" />;
}
