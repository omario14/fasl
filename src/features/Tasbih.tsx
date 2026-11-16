import { useCallback, useEffect, useRef, useState } from 'react';
import { vibrate } from '../core/audio';
import { isNative, keepAwake } from '../core/native';
import { useApp } from '../core/store';
import { addDays, keyOf } from '../core/time';
import { useI18n } from '../i18n';
import { Sheet } from '../ui/controls';
import { IReset } from '../ui/Icons';

type Mode = 'seq' | '33' | '99' | 'custom' | 'free';
interface Step {
  ar: string;
  tr: string;
  n: number;
}

const SEQ: Step[] = [
  { ar: 'سُبْحَانَ اللهِ', tr: 'Subḥāna llāh', n: 33 },
  { ar: 'الْحَمْدُ لِلَّهِ', tr: 'Al-ḥamdu lillāh', n: 33 },
  { ar: 'اللهُ أَكْبَرُ', tr: 'Allāhu akbar', n: 34 },
];

type WakeLock = { release: () => Promise<void> };

/** Keeps the screen awake while counting; released after a minute without taps. */
function useWakeLock() {
  const lock = useRef<WakeLock | null>(null);
  const timer = useRef<number>(undefined);
  const touch = useCallback(async () => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      void lock.current?.release();
      lock.current = null;
      if (isNative) keepAwake(false);
    }, 60_000);
    if (isNative) {
      keepAwake(true);
      return;
    }
    if (lock.current) return;
    try {
      const wl = (navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<WakeLock> } }).wakeLock;
      if (wl) lock.current = await wl.request('screen');
    } catch {
      /* not allowed: carry on */
    }
  }, []);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      void lock.current?.release();
      if (isNative) keepAwake(false);
    },
    [],
  );
  return touch;
}

export default function TasbihPage() {
  const { s, set, data, setData, today } = useApp();
  const { t, digits } = useI18n();
  const [mode, setMode] = useState<Mode>('seq');
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const [custom, setCustom] = useState(100);
  const [askCustom, setAskCustom] = useState(false);
  const [done, setDone] = useState(false);
  const [pulse, setPulse] = useState(0);
  const wake = useWakeLock();

  const steps: Step[] =
    mode === 'seq' ? SEQ : mode === '33' ? [{ ...SEQ[0], n: 33 }] : mode === '99' ? [{ ...SEQ[0], n: 99 }] : mode === 'custom' ? [{ ar: 'ذِكْرٌ', tr: 'Dhikr', n: custom }] : [{ ar: 'ذِكْرٌ', tr: 'Dhikr', n: 0 }];
  const cur = steps[Math.min(step, steps.length - 1)];
  const target = cur.n;
  const dayKey = keyOf(today);

  const reset = () => {
    setStep(0);
    setCount(0);
    setDone(false);
  };
  const pick = (m: Mode) => {
    setMode(m);
    reset();
  };

  const tap = () => {
    void wake();
    if (s.haptics) vibrate(12);
    setPulse((p) => p + 1);
    setData((d) => ({ tasbih: { ...d.tasbih, [dayKey]: (d.tasbih[dayKey] ?? 0) + 1 } }));
    if (done) {
      reset();
      setCount(1);
      return;
    }
    const next = count + 1;
    if (target && next >= target) {
      if (step < steps.length - 1) {
        if (s.haptics) vibrate([0, 40, 60, 40]);
        setStep(step + 1);
        setCount(0);
      } else {
        if (s.haptics) vibrate([0, 60, 80, 60]);
        setCount(next);
        setDone(true);
      }
    } else setCount(next);
  };

  // Space / Enter count from the keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('button, input, select, textarea, a, [role="dialog"]')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const progress = target ? Math.min(1, count / target) : 0;
  const week = Array.from({ length: 7 }, (_, k) => {
    const d = addDays(today, k - 6);
    return { k: keyOf(d), n: data.tasbih[keyOf(d)] ?? 0, d };
  });
  const max = Math.max(1, ...week.map((w) => w.n));

  return (
    <div className="page tasbih">
      <button className="tap-zone" onClick={tap} aria-label={`${t('tasbih.tap')} · ${count}`}>
        <span className="tz-name ar" lang="ar">
          {done ? 'تَقَبَّلَ اللهُ' : cur.ar}
        </span>
        <span className="tz-tr">{done ? t('tasbih.complete') : cur.tr}</span>
        <span className="tz-count num" key={pulse}>
          {digits(count)}
        </span>
        <span className="tz-of num">{target ? t('tasbih.of', { n: target }) : t('tasbih.free')}</span>
        {steps.length > 1 && (
          <span className="tz-steps" aria-hidden>
            {steps.map((_, k) => (
              <span key={k} className={k < step || done ? 'on' : k === step ? 'cur' : ''} />
            ))}
          </span>
        )}
        <span className="tz-bar" aria-hidden>
          <span style={{ transform: `scaleX(${progress})` }} />
        </span>
        <span className="tz-hint">{t('tasbih.tap')}</span>
      </button>

      <div className="tasbih-bar card">
        <div className="seg" role="group" aria-label={t('tasbih.target')}>
          <button aria-pressed={mode === 'seq'} onClick={() => pick('seq')}>
            {t('tasbih.seq')}
          </button>
          <button aria-pressed={mode === '33'} onClick={() => pick('33')}>
            {digits(33)}
          </button>
          <button aria-pressed={mode === '99'} onClick={() => pick('99')}>
            {digits(99)}
          </button>
          <button aria-pressed={mode === 'custom'} onClick={() => setAskCustom(true)}>
            {mode === 'custom' ? digits(custom) : t('tasbih.custom')}
          </button>
          <button aria-pressed={mode === 'free'} onClick={() => pick('free')}>
            ∞
          </button>
        </div>
        <div className="tasbih-actions">
          <button className="btn btn-quiet" onClick={() => set({ haptics: !s.haptics })} aria-pressed={s.haptics}>
            {t('tasbih.haptics')} · {s.haptics ? t('on') : t('off')}
          </button>
          <button className="btn btn-ghost" onClick={reset}>
            <IReset />
            {t('tasbih.reset')}
          </button>
        </div>
      </div>

      <section className="section card tasbih-week" aria-labelledby="tw">
        <div className="section-head">
          <h2 id="tw" className="section-title">
            {t('tasbih.week')}
          </h2>
          <span className="caps">
            {t('tasbih.today')} · {digits(week[6].n)}
          </span>
        </div>
        <div className="week-bars">
          {week.map((w) => (
            <div key={w.k} className="wb">
              <span className="wb-bar" style={{ height: `${Math.max(4, (w.n / max) * 100)}%` }} title={String(w.n)} />
              <span className="wb-d num">{digits(w.d.d)}</span>
            </div>
          ))}
        </div>
      </section>

      {askCustom && (
        <Sheet title={t('tasbih.set')} onClose={() => setAskCustom(false)} closeLabel={t('close')}>
          <form
            className="custom-form"
            onSubmit={(e) => {
              e.preventDefault();
              setAskCustom(false);
              pick('custom');
            }}
          >
            <label className="row-title" htmlFor="custom-n">
              {t('tasbih.target')}
            </label>
            <input id="custom-n" className="field num" type="number" min={1} max={100000} value={custom} onChange={(e) => setCustom(Math.max(1, Number(e.target.value) || 1))} />
            <div className="seg">
              {[7, 10, 100, 313, 1000].map((n) => (
                <button type="button" key={n} aria-pressed={custom === n} onClick={() => setCustom(n)}>
                  {digits(n)}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" type="submit">
              {t('tasbih.set')}
            </button>
          </form>
        </Sheet>
      )}
    </div>
  );
}
