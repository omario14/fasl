import { Coordinates, HighLatitudeRule, Madhab, PrayerTimes } from 'adhan';
import { methodParams } from './config';
import { addDays, addMin, dayOfYear, keyOf, MIN, type YMD } from './time';
import type { PrayerId, PrayerSpan, Settings, TimeWindow, Urgency, WindowKind } from './types';

/**
 * The prayer-window engine.
 *
 * adhan computes the astronomical events (dawn, sunrise, zawal, shadow lengths, sunset, twilight).
 * Fasl turns those into the four jurisprudential windows of each prayer:
 * preferred (fadhila) → permissible (jawaz) → necessity / obligation (darura, wujub) → makrooh.
 */

export interface DayTimes {
  key: string;
  ymd: YMD;
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  /** Midpoint between Maghrib and the next Fajr. */
  midnight: Date;
  lastThird: Date;
  /** End of the forbidden time after sunrise (≈ sun one spear high). */
  ishraq: Date;
  spans: PrayerSpan[];
}

type CalcSettings = Pick<
  Settings,
  'method' | 'customFajr' | 'customIsha' | 'asr' | 'highLat' | 'offsets' | 'location'
>;

const cache = new Map<string, DayTimes>();

function sig(s: CalcSettings) {
  const l = s.location;
  return [s.method, s.customFajr, s.customIsha, s.asr, s.highLat, JSON.stringify(s.offsets), l.lat.toFixed(4), l.lng.toFixed(4)].join('|');
}

/** Raw astronomical times for a calendar date (adhan uses the date's Y/M/D components). */
function raw(s: CalcSettings, ymd: YMD, madhab?: 'hanafi' | 'shafi') {
  const p = methodParams(s);
  p.madhab = madhab ?? (s.asr === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi);
  p.highLatitudeRule =
    s.highLat === 'seventh'
      ? HighLatitudeRule.SeventhOfTheNight
      : s.highLat === 'middle'
        ? HighLatitudeRule.MiddleOfTheNight
        : HighLatitudeRule.TwilightAngle;
  p.adjustments = {
    fajr: s.offsets.fajr,
    sunrise: 0,
    dhuhr: s.offsets.dhuhr,
    asr: s.offsets.asr,
    maghrib: s.offsets.maghrib,
    isha: s.offsets.isha,
  };
  const coords = new Coordinates(s.location.lat, s.location.lng);
  return { pt: new PrayerTimes(coords, new Date(ymd.y, ymd.m - 1, ymd.d, 12), p), params: p };
}

/** Does the sun reach `angle` degrees below the horizon at this latitude on this day? */
function twilightReachable(lat: number, ymd: YMD, angle: number) {
  const decl = 23.44 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear(ymd) - 81));
  const r = Math.PI / 180;
  const cosH = (Math.sin(-angle * r) - Math.sin(lat * r) * Math.sin(decl * r)) / (Math.cos(lat * r) * Math.cos(decl * r));
  return cosH >= -1 && cosH <= 1;
}

/** "Nearest day" high-latitude rule: borrow Fajr/Isha offsets from the closest day with real twilight. */
function nearestDayTimes(s: CalcSettings, ymd: YMD, pt: PrayerTimes, fajrAngle: number, ishaAngle: number) {
  const lat = s.location.lat;
  const angle = Math.max(fajrAngle, ishaAngle);
  if (twilightReachable(lat, ymd, angle)) return null;
  for (let n = 1; n < 183; n++) {
    for (const dir of [-1, 1]) {
      const cand = addDays(ymd, n * dir);
      if (twilightReachable(lat, cand, angle)) {
        const { pt: c } = raw(s, cand);
        const fajrBefore = c.sunrise.getTime() - c.fajr.getTime();
        const ishaAfter = c.isha.getTime() - c.maghrib.getTime();
        return {
          fajr: new Date(pt.sunrise.getTime() - fajrBefore),
          isha: new Date(pt.maghrib.getTime() + ishaAfter),
        };
      }
    }
  }
  return null;
}

const clampDate = (d: Date, lo: Date, hi: Date) => new Date(Math.min(Math.max(d.getTime(), lo.getTime()), hi.getTime()));
const lerp = (a: Date, b: Date, t: number) => new Date(a.getTime() + (b.getTime() - a.getTime()) * t);
const minutes = (a: Date, b: Date) => (b.getTime() - a.getTime()) / MIN;

/** Builds windows from ordered cut points, dropping empty slices. */
function slice(points: Date[], kinds: WindowKind[]): TimeWindow[] {
  const out: TimeWindow[] = [];
  for (let i = 0; i < kinds.length; i++) {
    const start = points[i];
    const end = points[i + 1];
    if (end.getTime() - start.getTime() >= MIN / 2) out.push({ kind: kinds[i], start, end });
  }
  return out;
}

function baseDay(s: CalcSettings, ymd: YMD) {
  const { pt, params } = raw(s, ymd);
  let fajr = pt.fajr;
  let isha = pt.isha;
  if (s.highLat === 'nearest') {
    const nd = nearestDayTimes(s, ymd, pt, params.fajrAngle, params.ishaAngle || 17);
    if (nd) {
      fajr = addMin(nd.fajr, s.offsets.fajr);
      isha = addMin(nd.isha, s.offsets.isha);
    }
  }
  return { pt, fajr, isha };
}

export function computeDay(s: CalcSettings, ymd: YMD): DayTimes {
  const key = keyOf(ymd);
  const ck = sig(s) + '#' + key;
  const hit = cache.get(ck);
  if (hit) return hit;

  const { pt, fajr, isha } = baseDay(s, ymd);
  const next = baseDay(s, addDays(ymd, 1));
  const { sunrise, dhuhr, asr, maghrib } = pt;
  const nextFajr = next.fajr;

  const night = nextFajr.getTime() - maghrib.getTime();
  const midnight = new Date(maghrib.getTime() + night / 2);
  const firstThird = new Date(maghrib.getTime() + night / 3);
  const lastThird = new Date(maghrib.getTime() + (2 * night) / 3);
  const ishraq = addMin(sunrise, 15);

  // FAJR — preferred until the horizon brightens (first ~40%), permissible, necessity just before
  // sunrise, makrooh in the final minutes as the disc approaches.
  const fd = minutes(fajr, sunrise);
  const fajrW = slice(
    [fajr, lerp(fajr, sunrise, 0.4), addMin(sunrise, -Math.min(25, fd * 0.22)), addMin(sunrise, -Math.min(12, fd * 0.1)), sunrise],
    ['preferred', 'permissible', 'necessity', 'makrooh'],
  );

  // DHUHR — preferred through the first quarter of the afternoon, permissible until the last
  // minutes before Asr enters.
  const dd = minutes(dhuhr, asr);
  const dhuhrW = slice(
    [dhuhr, lerp(dhuhr, asr, 0.25), addMin(asr, -Math.min(20, dd * 0.12)), asr],
    ['preferred', 'permissible', 'necessity'],
  );

  // ASR — preferred until the shadow doubles (the Hanafi Asr entry for the majority),
  // obligation until the sun yellows (~20 min before sunset), makrooh until the disc touches,
  // forbidden to begin during the setting itself.
  const yellow = addMin(maghrib, -20);
  let prefEnd: Date;
  if (s.asr === 'standard') {
    prefEnd = raw(s, ymd, 'hanafi').pt.asr;
  } else {
    prefEnd = lerp(asr, yellow, 0.5);
  }
  prefEnd = clampDate(prefEnd, addMin(asr, 5), addMin(yellow, -5));
  const asrW = slice(
    [asr, prefEnd, yellow, addMin(maghrib, -4), maghrib],
    ['preferred', 'obligation', 'makrooh', 'forbidden'],
  );

  // MAGHRIB — preferred immediately at sunset, permissible until the red twilight fades (Isha entry).
  const md = minutes(maghrib, isha);
  const maghribW = slice(
    [maghrib, addMin(maghrib, Math.min(10, md * 0.2)), addMin(isha, -Math.min(15, md * 0.2)), isha],
    ['preferred', 'permissible', 'necessity'],
  );

  // ISHA — preferred through the first third of the night, recommended until midnight,
  // necessity (Hanafi allowance) until dawn.
  const ishaPrefEnd = firstThird.getTime() > isha.getTime() + 20 * MIN ? firstThird : addMin(isha, 20);
  const ishaW = slice(
    [isha, clampDate(ishaPrefEnd, isha, midnight), clampDate(midnight, isha, nextFajr), nextFajr],
    ['preferred', 'recommended', 'necessity'],
  );

  const spans: PrayerSpan[] = [
    { id: 'fajr', dayKey: key, adhan: fajr, end: sunrise, windows: fajrW },
    { id: 'dhuhr', dayKey: key, adhan: dhuhr, end: asr, windows: dhuhrW },
    { id: 'asr', dayKey: key, adhan: asr, end: maghrib, windows: asrW },
    { id: 'maghrib', dayKey: key, adhan: maghrib, end: isha, windows: maghribW },
    { id: 'isha', dayKey: key, adhan: isha, end: nextFajr, windows: ishaW },
  ];

  const out: DayTimes = { key, ymd, fajr, sunrise, dhuhr, asr, maghrib, isha, midnight, lastThird, ishraq, spans };
  cache.set(ck, out);
  if (cache.size > 400) cache.delete(cache.keys().next().value!);
  return out;
}

export const MAKROOH_KINDS: WindowKind[] = ['makrooh', 'forbidden'];
const URGENT_MIN = 15;

export interface Position {
  now: Date;
  /** Prayer whose time is running now, if any (none between sunrise and Dhuhr). */
  active: PrayerSpan | null;
  window: TimeWindow | null;
  /** End of the last window in which the prayer may be started without karaha. */
  validEnd: Date | null;
  next: PrayerSpan;
  prev: PrayerSpan;
  urgency: Urgency;
  prayed: boolean;
}

/** Timeline from yesterday to tomorrow, so Isha after midnight and tomorrow's Fajr are covered. */
export function timeline(s: CalcSettings, today: YMD) {
  return [-1, 0, 1].flatMap((n) => computeDay(s, addDays(today, n)).spans);
}

export function position(
  s: CalcSettings,
  today: YMD,
  now: Date,
  isPrayed: (span: PrayerSpan) => boolean,
): Position {
  const spans = timeline(s, today);
  const t = now.getTime();
  const active = spans.find((p) => p.adhan.getTime() <= t && t < p.end.getTime()) ?? null;
  const next = spans.find((p) => p.adhan.getTime() > t) ?? spans[spans.length - 1];
  const prev = [...spans].reverse().find((p) => p.adhan.getTime() <= t) ?? spans[0];
  const window = active?.windows.find((w) => w.start.getTime() <= t && t < w.end.getTime()) ?? null;
  const valid = active?.windows.filter((w) => !MAKROOH_KINDS.includes(w.kind)) ?? [];
  const validEnd = valid.length ? valid[valid.length - 1].end : null;
  const prayed = active ? isPrayed(active) : false;

  let urgency: Urgency;
  if (!active || prayed) {
    urgency = next.adhan.getTime() - t <= 30 * MIN ? 'approaching' : 'calm';
  } else if (!window || MAKROOH_KINDS.includes(window.kind)) {
    urgency = 'makrooh';
  } else if (validEnd && validEnd.getTime() - t <= URGENT_MIN * MIN) {
    urgency = 'urgent';
  } else if (window.kind === 'preferred') {
    urgency = 'preferred';
  } else if (window.kind === 'permissible' || window.kind === 'recommended') {
    urgency = 'permissible';
  } else {
    urgency = 'obligation';
  }
  return { now, active, window, validEnd, next, prev, urgency, prayed };
}

export const spanKey = (p: { id: PrayerId; dayKey: string }) => `${p.dayKey}:${p.id}`;
