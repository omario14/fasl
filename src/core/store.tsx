import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_SETTINGS } from './config';
import { position, spanKey, type Position } from './prayer';
import { deviceTz, ymdInTz, type YMD } from './time';
import { RTL_LANGS, type Lang, type PrayerId, type Settings } from './types';

const S_KEY = 'fasl.settings.v1';
const D_KEY = 'fasl.data.v1';

export interface UserData {
  /** spanKey → ISO time the prayer was marked prayed */
  prayed: Record<string, string>;
  qadha: Record<PrayerId, number>;
  qadhaDone: Record<PrayerId, number>;
  qadhaPerDay: number;
  /** span keys already added to the owed count, so they are never counted twice */
  qadhaLogged: Record<string, true>;
  bookmarks: number[];
  tasbih: Record<string, number>; // date key → count
  ramadan: Record<string, boolean>; // date key → fasted
}

const DEFAULT_DATA: UserData = {
  prayed: {},
  qadha: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
  qadhaDone: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
  qadhaPerDay: 2,
  qadhaLogged: {},
  bookmarks: [],
  tasbih: {},
  ramadan: {},
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return deepMerge(fallback, JSON.parse(raw));
  } catch {
    return fallback;
  }
}

function deepMerge<T>(base: T, over: unknown): T {
  if (typeof base !== 'object' || base === null || Array.isArray(base)) return (over ?? base) as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  if (over && typeof over === 'object') {
    for (const [k, v] of Object.entries(over)) {
      const b = (base as Record<string, unknown>)[k];
      out[k] = b && typeof b === 'object' && !Array.isArray(b) ? deepMerge(b, v) : v;
    }
  }
  return out as T;
}

function save(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* storage unavailable: the app keeps working for this visit */
  }
}

function detectLang(): Lang {
  const l = (navigator.language || 'en').toLowerCase();
  if (l.startsWith('ar')) return 'ar';
  if (l.startsWith('fr')) return 'fr';
  if (l.startsWith('tr')) return 'tr';
  return 'en';
}

interface Ctx {
  s: Settings;
  set: (patch: Partial<Settings> | ((s: Settings) => Partial<Settings>)) => void;
  data: UserData;
  setData: (fn: (d: UserData) => Partial<UserData>) => void;
  now: Date;
  tz: string;
  today: YMD;
  pos: Position;
  togglePrayed: (k: { id: PrayerId; dayKey: string }) => void;
  isPrayed: (k: { id: PrayerId; dayKey: string }) => boolean;
  rtl: boolean;
  resolvedTheme: 'dark' | 'light';
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(() => {
    const loaded = load(S_KEY, DEFAULT_SETTINGS);
    if (!localStorage.getItem(S_KEY)) loaded.lang = detectLang();
    return loaded;
  });
  const [data, setD] = useState<UserData>(() => load(D_KEY, DEFAULT_DATA));
  const [now, setNow] = useState(() => new Date());
  const [sysDark, setSysDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => save(S_KEY, s), [s]);
  useEffect(() => save(D_KEY, data), [data]);

  // Tick: align to the second so countdowns roll over on the minute exactly.
  useEffect(() => {
    let id: number;
    const tick = () => {
      setNow(new Date());
      id = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    id = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    const vis = () => document.visibilityState === 'visible' && setNow(new Date());
    document.addEventListener('visibilitychange', vis);
    return () => {
      clearTimeout(id);
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = () => setSysDark(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const set = useCallback<Ctx['set']>((patch) => {
    setS((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);
  const setData = useCallback<Ctx['setData']>((fn) => setD((prev) => ({ ...prev, ...fn(prev) })), []);

  const tz = s.tzMode === 'auto' && s.location.mode === 'gps' ? deviceTz() : s.location.tz;
  const minuteStamp = Math.floor(now.getTime() / 60000);
  const today = useMemo(() => ymdInTz(now, tz), [tz, minuteStamp]); // eslint-disable-line react-hooks/exhaustive-deps

  const isPrayed = useCallback((k: { id: PrayerId; dayKey: string }) => !!data.prayed[spanKey(k)], [data.prayed]);
  const togglePrayed = useCallback(
    (k: { id: PrayerId; dayKey: string }) =>
      setData((d) => {
        const key = spanKey(k);
        const prayed = { ...d.prayed };
        if (prayed[key]) delete prayed[key];
        else prayed[key] = new Date().toISOString();
        // keep the log to the last ~60 days
        const keys = Object.keys(prayed).sort();
        if (keys.length > 320) for (const old of keys.slice(0, keys.length - 320)) delete prayed[old];
        return { prayed };
      }),
    [setData],
  );

  const pos = useMemo(() => position(s, today, now, isPrayed), [s, today, now, isPrayed]);

  const rtl = RTL_LANGS.includes(s.lang);
  const resolvedTheme = s.theme === 'auto' ? (sysDark ? 'dark' : 'light') : s.theme;

  useEffect(() => {
    const html = document.documentElement;
    html.lang = s.lang;
    html.dir = rtl ? 'rtl' : 'ltr';
    html.dataset.theme = resolvedTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolvedTheme === 'dark' ? '#0E1A14' : '#F5EFE4');
  }, [s.lang, rtl, resolvedTheme]);

  const value: Ctx = { s, set, data, setData, now, tz, today, pos, togglePrayed, isPrayed, rtl, resolvedTheme };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside provider');
  return c;
}

/** Re-renders at most once a minute: for components that only show minutes. */
export function useMinute() {
  const { now } = useApp();
  const ref = useRef(Math.floor(now.getTime() / 60000));
  ref.current = Math.floor(now.getTime() / 60000);
  return ref.current;
}
