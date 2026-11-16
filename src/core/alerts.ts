import { useEffect, useMemo, useRef } from 'react';
import { useI18n, type I18n } from '../i18n';
import type { Key } from '../i18n/en';
import { toast } from '../ui/toast';
import { chime, playAdhan, vibrate } from './audio';
import { PRAYER_AR, PRAYER_COLOR, PRAYER_LATIN, URGENCY_COLOR } from './config';
import { isNative, scheduleAlerts, setStatusTimeline, setWidgetData, type Alert, type Channel, type StatusItem } from './native';
import { HIJRI_MONTHS, toHijri } from './hijri';
import { computeDay, MAKROOH_KINDS, position } from './prayer';
import { statusOf } from './status';
import { useApp } from './store';
import { addDays, addMin, MIN, weekday, ymdInTz, type YMD } from './time';
import type { PrayerId, PrayerSpan, Settings } from './types';

export function ramadanActive(s: Settings, today: YMD) {
  if (s.fasting.ramadanMode === 'on') return true;
  if (s.fasting.ramadanMode === 'off') return false;
  return toHijri(today, s.hijriOffset).m === 9;
}

interface Trigger {
  at: Date;
  key: string;
  span?: PrayerSpan;
  kind: 'adhan' | 'prefEnd' | 'obl' | 'mak' | 'morning' | 'evening' | 'suhoor' | 'iftar' | 'tarawih' | 'sunnah';
}

function buildTriggers(s: Settings, today: YMD, ahead = 1): Trigger[] {
  const out: Trigger[] = [];
  const days = Array.from({ length: ahead + 2 }, (_, k) => computeDay(s, addDays(today, k - 1)));
  for (const day of days) {
    for (const span of day.spans) {
      const pn = s.notify.perPrayer[span.id];
      if (!s.notify.master || !pn.on) continue;
      const k = `${span.dayKey}:${span.id}`;
      out.push({ at: span.adhan, key: `${k}:adhan`, span, kind: 'adhan' });
      const pref = span.windows.find((w) => w.kind === 'preferred');
      if (pn.preferredEnd && pref) out.push({ at: pref.end, key: `${k}:pref`, span, kind: 'prefEnd' });
      const obl = span.windows.find((w) => w.kind === 'obligation' || w.kind === 'necessity');
      if (pn.obligation && obl) out.push({ at: obl.start, key: `${k}:obl`, span, kind: 'obl' });
      const mak = span.windows.find((w) => MAKROOH_KINDS.includes(w.kind));
      if (pn.makrooh && mak) out.push({ at: mak.start, key: `${k}:mak`, span, kind: 'mak' });
    }
    if (s.adhkar.morning) out.push({ at: addMin(day.fajr, s.adhkar.morningOffset), key: `${day.key}:morning`, kind: 'morning' });
    if (s.adhkar.evening) out.push({ at: addMin(day.maghrib, -s.adhkar.eveningOffset), key: `${day.key}:evening`, kind: 'evening' });
    if (ramadanActive(s, day.ymd)) {
      out.push({ at: addMin(day.fajr, -s.fasting.suhoorBefore), key: `${day.key}:suhoor`, kind: 'suhoor' });
      out.push({ at: s.fasting.iftarMode === 'adhan' ? day.maghrib : addMin(day.maghrib, -s.fasting.iftarBefore), key: `${day.key}:iftar`, kind: 'iftar' });
      if (s.fasting.tarawih) out.push({ at: day.isha, key: `${day.key}:tarawih`, kind: 'tarawih' });
    } else if (s.fasting.sunnahFasts) {
      const wd = weekday(addDays(day.ymd, 1));
      if (wd === 1 || wd === 4) out.push({ at: addMin(day.isha, 30), key: `${day.key}:sunnah`, kind: 'sunnah' });
    }
  }
  return out.sort((a, b) => a.at.getTime() - b.at.getTime());
}

async function systemNotify(title: string, body: string, tag: string, silent: boolean) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    const opts: NotificationOptions = { body, tag, silent, icon: './icon.svg', badge: './icon.svg' };
    if (reg) await reg.showNotification(title, opts);
    else new Notification(title, opts);
  } catch {
    /* ignore */
  }
}

function describe(tr: Trigger, i: I18n, s: Settings): { title: string; body: string; color: string } {
  const { t, time } = i;
  const p = tr.span ? PRAYER_AR[tr.span.id] : '';
  switch (tr.kind) {
    case 'adhan':
      return { title: t('notif.adhan', { p }), body: t('notif.adhanBody', { t: time(tr.at) }), color: URGENCY_COLOR.preferred };
    case 'prefEnd':
      return { title: t('notif.prefEnd', { p }), body: t('notif.prefEndBody', { t: time(tr.span!.end) }), color: URGENCY_COLOR.permissible };
    case 'obl':
      return { title: t('notif.obl', { p }), body: t('notif.oblBody', { t: time(tr.span!.end) }), color: URGENCY_COLOR.obligation };
    case 'mak': {
      const e = tr.span!.id === 'fajr' ? t('ev.sunrise') : t('ev.sunset');
      return { title: t('notif.mak', { p }), body: t('notif.makBody', { e, t: time(tr.span!.end) }), color: URGENCY_COLOR.makrooh };
    }
    case 'morning':
      return { title: t('notif.morning'), body: t('notif.adhkarBody'), color: '#3A6EA8' };
    case 'evening':
      return { title: t('notif.evening'), body: t('notif.adhkarBody'), color: '#B85C3A' };
    case 'suhoor':
      return { title: t('notif.suhoor', { t: time(addMin(tr.at, s.fasting.suhoorBefore)) }), body: t('rmd.title'), color: '#3A6EA8' };
    case 'iftar':
      return { title: t('notif.iftar', { t: time(tr.at) }), body: t('rmd.title'), color: '#B85C3A' };
    case 'tarawih':
      return { title: t('rmd.tarawih', { t: time(tr.at) }), body: t('rmd.title'), color: '#1D6B5E' };
    case 'sunnah': {
      const wd = weekday(addDays({ y: tr.at.getFullYear(), m: tr.at.getMonth() + 1, d: tr.at.getDate() }, 1));
      return { title: t('notif.sunnah', { d: wd === 1 ? t('day.mon') : t('day.thu') }), body: '', color: '#C9A84C' };
    }
  }
}

/** Drives alerts, haptics, the tab title, the live favicon and the pinned system notification. */
export function useAlerts() {
  const { s, pos, today, now, isPrayed } = useApp();
  const i = useI18n();
  const triggers = useMemo(() => buildTriggers(s, today), [s, today]);
  const last = useRef(Date.now());
  const lastUrgency = useRef(pos.urgency);
  const minute = Math.floor(now.getTime() / 60000);

  // Fire triggers that fell between the last tick and now.
  useEffect(() => {
    const from = last.current;
    const to = now.getTime();
    last.current = to;
    if (isNative) return; // the installed app schedules real Android notifications instead
    if (to - from > 5 * 60000 || to <= from) return; // waking from sleep: don't flood
    for (const tr of triggers) {
      const at = tr.at.getTime();
      if (at <= from || at > to) continue;
      if (tr.span && tr.kind !== 'adhan' && isPrayed(tr.span)) continue;
      const d = describe(tr, i, s);
      toast(d.title, d.body, d.color, tr.kind === 'adhan' ? 12000 : 7000);
      void systemNotify(d.title, d.body, tr.key, tr.kind !== 'adhan');
      if (tr.kind === 'adhan' && tr.span) {
        const pn = s.notify.perPrayer[tr.span.id];
        void playAdhan({ voice: pn.voice, mode: pn.sound, prayer: tr.span.id, volume: s.notify.volume, ramp: s.notify.ramp, fajrVariant: s.notify.fajrVariant });
      } else if (tr.kind === 'prefEnd') {
        chime(s.notify.volume * 0.6, true);
      }
    }
  }, [now]); // eslint-disable-line react-hooks/exhaustive-deps

  // One haptic pulse on entering the urgent state.
  useEffect(() => {
    if (pos.urgency === 'urgent' && lastUrgency.current !== 'urgent' && s.notify.vibration) vibrate([0, 180]);
    lastUrgency.current = pos.urgency;
  }, [pos.urgency, s.notify.vibration]);

  // Tab title, live favicon, pinned notification — once a minute.
  const st = useMemo(() => statusOf(pos, i), [minute, pos.urgency, pos.prayed, i]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    document.title = `${st.plain} — Fasl`;
    drawFavicon(st.progress, st.color);
    if (s.notify.systemPin && !isNative) {
      const [title, ...rest] = st.plain.split(' · ');
      void systemNotify(title, rest.join(' · '), 'fasl-live', true);
    }
  }, [st, s.notify.systemPin]);

  useEffect(() => {
    if (s.notify.systemPin || isNative) return;
    void navigator.serviceWorker?.getRegistration().then((reg) =>
      reg?.getNotifications({ tag: 'fasl-live' }).then((ns) => ns.forEach((n) => n.close())),
    );
  }, [s.notify.systemPin]);

  useNativeSchedule();
}

let favCanvas: HTMLCanvasElement | null = null;
function drawFavicon(progress: number, color: string) {
  try {
    favCanvas ??= document.createElement('canvas');
    const c = favCanvas;
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    g.clearRect(0, 0, 64, 64);
    g.fillStyle = '#0E1A14';
    g.beginPath();
    g.arc(32, 32, 31, 0, Math.PI * 2);
    g.fill();
    g.lineWidth = 7;
    g.strokeStyle = 'rgba(139,175,150,0.25)';
    g.beginPath();
    g.arc(32, 32, 23, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = color;
    g.lineCap = 'round';
    g.beginPath();
    g.arc(32, 32, 23, -Math.PI / 2, -Math.PI / 2 + Math.max(0.05, progress) * Math.PI * 2);
    g.stroke();
    g.fillStyle = '#C9A84C';
    g.font = 'bold 30px Amiri, serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('ف', 32, 30);
    const link = document.getElementById('favicon') as HTMLLinkElement | null;
    if (link) {
      link.type = 'image/png';
      link.href = c.toDataURL('image/png');
    }
  } catch {
    /* ignore */
  }
}


const CHANNEL: Record<Trigger['kind'], Channel> = {
  adhan: 'fasl-adhan',
  prefEnd: 'fasl-alerts',
  obl: 'fasl-alerts',
  mak: 'fasl-alerts',
  morning: 'fasl-reminders',
  evening: 'fasl-reminders',
  suhoor: 'fasl-reminders',
  iftar: 'fasl-reminders',
  tarawih: 'fasl-reminders',
  sunnah: 'fasl-reminders',
};

const AHEAD_DAYS = 3;

/** Where each alert leads when tapped. */
function routeOf(tr: Trigger) {
  switch (tr.kind) {
    case 'morning':
      return '/duaa/morning';
    case 'evening':
      return '/duaa/evening';
    case 'suhoor':
    case 'iftar':
    case 'sunnah':
      return '/calendar';
    case 'tarawih':
      return '/';
    default:
      return tr.span ? `/prayer/${tr.span.id}` : '/';
  }
}

/**
 * Installed app only: hands the next three days to Android — every alert as a scheduled
 * notification, and the status timeline for the always-on bar. Refreshed whenever the settings,
 * the day, or a prayed mark changes, and whenever the app comes back to the foreground.
 */
function useNativeSchedule() {
  const { s, today, tz, isPrayed, data } = useApp();
  const i = useI18n();
  const hour = Math.floor(Date.now() / 3_600_000);

  useEffect(() => {
    if (!isNative) return;
    const run = () => {
      const now = Date.now();
      const horizon = now + AHEAD_DAYS * 24 * 60 * MIN;
      const alerts: Alert[] = buildTriggers(s, today, AHEAD_DAYS)
        .filter((tr) => tr.at.getTime() > now && tr.at.getTime() <= horizon)
        .filter((tr) => !(tr.span && tr.kind !== 'adhan' && isPrayed(tr.span)))
        .slice(0, 120)
        .map((tr) => {
          const d = describe(tr, i, s);
          return { key: tr.key, at: tr.at, title: d.title, body: d.body, channel: CHANNEL[tr.kind], route: routeOf(tr) };
        });
      void scheduleAlerts(alerts);
      void setStatusTimeline(statusTimeline(s, tz, isPrayed, i, now, horizon), s.notify.statusBar);
      setWidgetData(widgetData(s, today, i, isPrayed));
    };
    run();
    const onVis = () => document.visibilityState === 'visible' && run();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [s, today, tz, data.prayed, i, hour]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Prayer times for the widgets: five spans per day from yesterday to the horizon. */
function widgetData(s: Settings, today: YMD, i: I18n, isPrayed: (k: { id: PrayerId; dayKey: string }) => boolean) {
  const days = Array.from({ length: AHEAD_DAYS + 2 }, (_, k) => computeDay(s, addDays(today, k - 1)));
  const hijri = (ymd: YMD) => {
    const h = toHijri(ymd, s.hijriOffset);
    return `${i.digits(h.d)} ${HIJRI_MONTHS[s.lang][h.m - 1]} ${i.digits(h.y)}`;
  };
  return {
    rtl: s.lang === 'ar',
    place: s.lang === 'ar' && s.location.nameAr ? s.location.nameAr : s.location.name,
    labels: { next: i.t('sb.next', { p: '' }).replace(/[·\s]+$/, ''), now: i.t('detail.now') },
    days: days.map((d) => ({
      key: d.key,
      hijri: hijri(d.ymd),
      spans: d.spans.map((sp) => ({
        id: sp.id,
        ar: PRAYER_AR[sp.id],
        latin: PRAYER_LATIN[sp.id],
        time: i.time(sp.adhan),
        adhan: sp.adhan.getTime(),
        end: sp.end.getTime(),
        color: PRAYER_COLOR[sp.id],
        prayed: isPrayed(sp),
      })),
    })),
  };
}

/** Every moment the bar's state changes over the horizon, with the countdown target for each. */
function statusTimeline(
  s: Settings,
  tz: string,
  isPrayed: (k: { id: PrayerId; dayKey: string }) => boolean,
  i: I18n,
  now: number,
  horizon: number,
): StatusItem[] {
  const { t, time } = i;
  const today = ymdInTz(new Date(now), tz);
  const spans = Array.from({ length: AHEAD_DAYS + 2 }, (_, k) => computeDay(s, addDays(today, k - 1)).spans).flat();
  const cuts = new Set<number>([now]);
  for (const sp of spans) {
    cuts.add(sp.adhan.getTime() - 30 * MIN);
    cuts.add(sp.adhan.getTime());
    cuts.add(sp.end.getTime());
    for (const w of sp.windows) cuts.add(w.start.getTime());
    const valid = sp.windows.filter((w) => !MAKROOH_KINDS.includes(w.kind));
    if (valid.length) cuts.add(valid[valid.length - 1].end.getTime() - 15 * MIN);
  }
  const times = [...cuts].filter((x) => x >= now && x <= horizon).sort((a, b) => a - b);
  const items: StatusItem[] = [];
  for (const at of times) {
    const probe = new Date(at + 1000);
    const pos = position(s, ymdInTz(probe, tz), probe, isPrayed);
    const p = pos.active && !pos.prayed ? pos.active.id : pos.next.id;
    const P = PRAYER_AR[p];
    let title: string;
    let body: string;
    let until: number;
    const w = pos.window;
    if (!pos.active || pos.prayed || !w) {
      title = t('sb.next', { p: P });
      body = `${t('detail.adhan')} ${time(pos.next.adhan)}`;
      until = pos.next.adhan.getTime();
    } else if (pos.urgency === 'urgent') {
      const end = pos.validEnd ?? w.end;
      title = t('sb.urgent', { p: P });
      body = t('dash.endsAt', { w: t(`win.${w.kind}` as Key), t: time(end) });
      until = end.getTime();
    } else if (pos.urgency === 'makrooh') {
      title = t('sb.makrooh', { p: P });
      body = t('dash.prayerEnds', { t: time(pos.active.end) });
      until = pos.active.end.getTime();
    } else {
      title = pos.urgency === 'preferred' ? t('sb.preferred', { p: P }) : pos.urgency === 'obligation' ? t('sb.obligation', { p: P }) : t('sb.permissible', { p: P });
      body = t('dash.endsAt', { w: t(`win.${w.kind}` as Key), t: time(w.end) });
      until = w.end.getTime();
    }
    const clean = (x: string) => x.replace(/^[!⚑\s·]+|[·\s]+$/g, '').trim();
    const waiting = !pos.active || pos.prayed || !w;
    const label = waiting
      ? clean(t('sb.next', { p: '' }))
      : pos.urgency === 'urgent'
        ? clean(t('sb.urgent', { p: '' }))
        : t(`win.${w!.kind}` as Key);
    const item: StatusItem = {
      at,
      title,
      body,
      color: URGENCY_COLOR[pos.urgency],
      until,
      prayer: P,
      prayerColor: PRAYER_COLOR[p],
      label,
      untilLabel: `${waiting ? t('detail.adhan') : t('detail.end')} ${time(new Date(until))}`,
      route: `/prayer/${p}`,
    };
    const prev = items[items.length - 1];
    if (prev && prev.title === item.title && prev.body === item.body && prev.color === item.color) continue;
    items.push(item);
  }
  return items;
}
