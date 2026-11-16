import type { I18n } from '../i18n';
import { PRAYER_AR, PRAYER_COLOR, URGENCY_COLOR } from './config';
import type { Position } from './prayer';
import { MIN } from './time';
import type { PrayerId } from './types';

export interface Status {
  title: string;
  /** Arabic prayer name to render in Amiri inside the title (replaces {p}). */
  prayer: PrayerId;
  body: string;
  color: string;
  chapter: string;
  /** 0..1 elapsed within the current window (or the wait until the next adhan). */
  progress: number;
  plain: string;
}

const frac = (a: Date, b: Date, now: Date) =>
  Math.min(1, Math.max(0, (now.getTime() - a.getTime()) / Math.max(1, b.getTime() - a.getTime())));

/** The six states of the persistent bar (SOP §3), plus "permissible" between preferred and obligation. */
export function statusOf(pos: Position, i: I18n): Status {
  const { t, time, dur } = i;
  const { now, active, window, validEnd, next, prev, urgency } = pos;
  const color = URGENCY_COLOR[urgency];
  const P = '⁨{P}⁩';

  let titleTpl: string;
  let body: string;
  let prayer: PrayerId;
  let progress: number;

  if (!active || pos.prayed || !window) {
    prayer = next.id;
    const waitStart = active && pos.prayed ? active.adhan : prev.end;
    progress = frac(waitStart, next.adhan, now);
    const left = next.adhan.getTime() - now.getTime();
    if (urgency === 'approaching') {
      titleTpl = t('sb.begins', { p: P, d: dur(left) });
      body = t('sb.beginsBody', { t: time(next.adhan) });
    } else {
      titleTpl = t('sb.next', { p: P });
      body = t('sb.in', { d: dur(left), t: time(next.adhan) });
    }
  } else {
    prayer = active.id;
    progress = frac(window.start, window.end, now);
    const toWindowEnd = window.end.getTime() - now.getTime();
    const endEvent =
      active.id === 'fajr' ? t('ev.sunrise') : active.id === 'asr' ? t('ev.sunset') : active.id === 'isha' ? t('ev.fajr') : active.id === 'dhuhr' ? t('ev.asr') : t('ev.isha');
    switch (urgency) {
      case 'preferred':
        titleTpl = t('sb.preferred', { p: P });
        body = t('sb.endsIn', { d: dur(toWindowEnd), t: time(window.end) });
        break;
      case 'permissible':
        titleTpl = t('sb.permissible', { p: P });
        body = t('sb.endsIn', { d: dur(toWindowEnd), t: time(window.end) });
        break;
      case 'obligation':
        titleTpl = t('sb.obligation', { p: P });
        body = t('sb.remaining', { d: dur(toWindowEnd), t: time(window.end) });
        break;
      case 'urgent': {
        const end = validEnd ?? window.end;
        titleTpl = t('sb.urgent', { p: P });
        body = t('sb.left', { d: dur(end.getTime() - now.getTime()), t: time(end) });
        progress = frac(new Date(end.getTime() - 15 * MIN), end, now);
        break;
      }
      default: {
        titleTpl = t('sb.makrooh', { p: P });
        body = t('sb.prayBefore', { e: endEvent, d: dur(active.end.getTime() - now.getTime()) });
        progress = frac(window.start, active.end, now);
      }
    }
  }
  const plain = `${titleTpl.replace(P, PRAYER_AR[prayer])} · ${body}`;
  return { title: titleTpl, prayer, body, color, chapter: PRAYER_COLOR[prayer], progress, plain };
}

export const PLACEHOLDER = '⁨{P}⁩';
