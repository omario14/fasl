export interface YMD {
  y: number;
  m: number; // 1-12
  d: number;
}

const partsCache = new Map<string, Intl.DateTimeFormat>();
function ymdFormatter(tz: string) {
  let f = partsCache.get(tz);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      f = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
    partsCache.set(tz, f);
  }
  return f;
}

/** Calendar date of an instant, as seen in a time zone. */
export function ymdInTz(date: Date, tz: string): YMD {
  const parts = ymdFormatter(tz).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get('year'), m: get('month'), d: get('day') };
}

export function addDays(ymd: YMD, n: number): YMD {
  const t = new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

export const keyOf = (ymd: YMD) =>
  `${ymd.y}-${String(ymd.m).padStart(2, '0')}-${String(ymd.d).padStart(2, '0')}`;

export function fromKey(key: string): YMD {
  const [y, m, d] = key.split('-').map(Number);
  return { y, m, d };
}

/** Day of week 0=Sunday for a calendar date. */
export const weekday = (ymd: YMD) => new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d)).getUTCDay();

export const dayOfYear = (ymd: YMD) =>
  Math.floor((Date.UTC(ymd.y, ymd.m - 1, ymd.d) - Date.UTC(ymd.y, 0, 0)) / 86400000);

export const MIN = 60_000;
export const addMin = (d: Date, m: number) => new Date(d.getTime() + m * MIN);

export function deviceTz() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** Splits a duration into hours and minutes, rounding up to the next whole minute. */
export function hm(ms: number) {
  const total = Math.max(0, Math.ceil(ms / MIN));
  return { h: Math.floor(total / 60), m: total % 60, total };
}
