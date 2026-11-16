import { addDays, type YMD } from './time';
import type { Lang } from './types';

export interface Hijri {
  y: number;
  m: number; // 1-12
  d: number;
}

let fmt: Intl.DateTimeFormat | null = null;
function formatter() {
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }
  return fmt;
}

const memo = new Map<string, Hijri>();

/** Umm al-Qura Hijri date of a Gregorian calendar day, shifted by the user's sighting offset. */
export function toHijri(g: YMD, offset = 0): Hijri {
  const k = `${g.y}-${g.m}-${g.d}|${offset}`;
  const hit = memo.get(k);
  if (hit) return hit;
  const s = addDays(g, offset);
  const parts = formatter().formatToParts(new Date(Date.UTC(s.y, s.m - 1, s.d, 12)));
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)?.value ?? '0', 10);
  const h = { y: get('year') || get('relatedYear'), m: get('month'), d: get('day') };
  memo.set(k, h);
  return h;
}

export const HIJRI_MONTHS: Record<Lang, string[]> = {
  ar: ['محرّم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجة'],
  en: ['Muharram', 'Safar', 'Rabiʿ al-Awwal', 'Rabiʿ al-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', 'Shaʿban', 'Ramadan', 'Shawwal', 'Dhu al-Qaʿdah', 'Dhu al-Hijjah'],
  fr: ['Mouharram', 'Safar', 'Rabiʿ al-awwal', 'Rabiʿ ath-thani', 'Joumada al-oula', 'Joumada ath-thania', 'Rajab', 'Chaʿbane', 'Ramadan', 'Chawwal', 'Dhou al-qiʿda', 'Dhou al-hijja'],
  tr: ['Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'],
};

export type EventId =
  | 'newyear'
  | 'ashura'
  | 'mawlid'
  | 'isra'
  | 'midshaban'
  | 'ramadan'
  | 'qadr'
  | 'qadr27'
  | 'fitr'
  | 'arafah'
  | 'adha';

export interface IslamicEvent {
  id: EventId;
  m: number;
  d: number;
  major?: boolean;
}

export const EVENTS: IslamicEvent[] = [
  { id: 'newyear', m: 1, d: 1 },
  { id: 'ashura', m: 1, d: 10 },
  { id: 'mawlid', m: 3, d: 12 },
  { id: 'isra', m: 7, d: 27 },
  { id: 'midshaban', m: 8, d: 15 },
  { id: 'ramadan', m: 9, d: 1, major: true },
  { id: 'qadr', m: 9, d: 21 },
  { id: 'qadr', m: 9, d: 23 },
  { id: 'qadr', m: 9, d: 25 },
  { id: 'qadr27', m: 9, d: 27, major: true },
  { id: 'qadr', m: 9, d: 29 },
  { id: 'fitr', m: 10, d: 1, major: true },
  { id: 'arafah', m: 12, d: 9 },
  { id: 'adha', m: 12, d: 10, major: true },
];

export function eventOn(h: Hijri) {
  return EVENTS.find((e) => e.m === h.m && e.d === h.d) ?? null;
}

/** Next event (excluding odd-night repeats unless `all`), searched day by day. */
export function nextEvent(from: YMD, offset: number, opts: { majorOnly?: boolean } = {}) {
  for (let i = 0; i < 400; i++) {
    const g = addDays(from, i);
    const h = toHijri(g, offset);
    const e = eventOn(h);
    if (e && (!opts.majorOnly || e.major) && e.id !== 'qadr') return { event: e, days: i, g, h };
  }
  return null;
}

/** Gregorian days that make up a Hijri month, starting from any day inside it. */
export function hijriMonthDays(anchor: YMD, offset: number) {
  const h0 = toHijri(anchor, offset);
  let start = addDays(anchor, -(h0.d - 1));
  // walk back if the first estimate isn't day 1
  for (let i = 0; i < 3 && toHijri(start, offset).d !== 1; i++) {
    const hd = toHijri(start, offset);
    start = addDays(start, hd.m === h0.m ? -(hd.d - 1) : 1);
  }
  const days: { g: YMD; h: Hijri }[] = [];
  for (let i = 0; i < 31; i++) {
    const g = addDays(start, i);
    const h = toHijri(g, offset);
    if (h.m !== h0.m) break;
    days.push({ g, h });
  }
  return { year: h0.y, month: h0.m, days };
}
