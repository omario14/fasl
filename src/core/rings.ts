import { computeDay } from './prayer';
import { addDays, keyOf, type YMD } from './time';
import { PRAYERS, type PrayerId, type PrayerSpan, type Settings } from './types';

/** How one arc of a day ring is drawn. */
export type ArcState = 'prayed' | 'active' | 'missed' | 'upcoming';
export type DayArcs = Record<PrayerId, ArcState>;

type IsPrayed = (k: { id: PrayerId; dayKey: string }) => boolean;

export function arcState(sp: PrayerSpan, now: number, isPrayed: IsPrayed): ArcState {
  if (isPrayed(sp)) return 'prayed';
  if (sp.adhan.getTime() > now) return 'upcoming';
  if (sp.end.getTime() > now) return 'active';
  return 'missed';
}

export function dayArcs(s: Settings, ymd: YMD, now: number, isPrayed: IsPrayed) {
  const day = computeDay(s, ymd);
  const arcs = {} as DayArcs;
  for (const sp of day.spans) arcs[sp.id] = arcState(sp, now, isPrayed);
  const prayed = PRAYERS.filter((p) => arcs[p] === 'prayed').length;
  return { day, arcs, prayed, complete: prayed === 5 };
}

/**
 * Consecutive complete days ending today (today counts once complete; an unfinished
 * today does not break a streak that ran through yesterday).
 */
export function streaks(s: Settings, today: YMD, now: number, isPrayed: IsPrayed, lookback = 60) {
  const complete: boolean[] = [];
  for (let k = 0; k < lookback; k++) complete.push(dayArcs(s, addDays(today, -k), now, isPrayed).complete);
  let current = 0;
  for (let k = complete[0] ? 0 : 1; k < complete.length && complete[k]; k++) current++;
  let best = 0;
  let run = 0;
  for (const c of complete) {
    run = c ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return { current, best };
}

export const dayKey = keyOf;
