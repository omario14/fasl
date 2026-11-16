import { Capacitor, registerPlugin } from '@capacitor/core';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

/** True inside the installed Android app (Capacitor), false in a browser. */
export const isNative = Capacitor.isNativePlatform();

export interface StatusItem {
  at: number;
  title: string;
  body: string;
  color: string;
  /** Instant the native chronometer counts down to. */
  until: number;
  /** For widgets: the prayer in focus, its colour, the state label and what `until` is. */
  prayer: string;
  prayerColor: string;
  label: string;
  untilLabel: string;
  route: string;
}

interface FaslNativePlugin {
  setStatusTimeline(o: { items: StatusItem[]; notify: boolean }): Promise<void>;
  clearStatus(): Promise<void>;
  keepAwake(o: { on: boolean }): Promise<void>;
  consumeRoute(): Promise<{ route?: string }>;
  setWidgetData(o: { json: string }): Promise<void>;
}

export const FaslNative = registerPlugin<FaslNativePlugin>('FaslNative');

export type Channel = 'fasl-adhan' | 'fasl-alerts' | 'fasl-reminders';

let channels: Promise<void> | null = null;
export function ensureChannels() {
  channels ??= (async () => {
    await LocalNotifications.createChannel({ id: 'fasl-adhan', name: 'Adhan', description: 'When each prayer time begins', importance: 5, visibility: 1, vibration: true });
    await LocalNotifications.createChannel({ id: 'fasl-alerts', name: 'Prayer windows', description: 'End of preferred time, obligation and makrooh time', importance: 4, visibility: 1, vibration: true });
    await LocalNotifications.createChannel({ id: 'fasl-reminders', name: 'Reminders', description: 'Adhkar, suhoor, iftar and fasting', importance: 3, visibility: 1 });
  })().catch(() => {});
  return channels;
}

export async function notifyPermission(): Promise<'granted' | 'denied' | 'prompt'> {
  try {
    const p = await LocalNotifications.checkPermissions();
    return p.display === 'granted' ? 'granted' : p.display === 'denied' ? 'denied' : 'prompt';
  } catch {
    return 'denied';
  }
}

export async function requestNotifyPermission() {
  try {
    return (await LocalNotifications.requestPermissions()).display === 'granted';
  } catch {
    return false;
  }
}

export async function exactAlarmsGranted() {
  try {
    return (await LocalNotifications.checkExactNotificationSetting()).exact_alarm === 'granted';
  } catch {
    return true;
  }
}

export async function openExactAlarmSettings() {
  try {
    await LocalNotifications.changeExactNotificationSetting();
  } catch {
    /* not needed below Android 12 */
  }
}

/** Stable 31-bit id from a trigger key, so re-scheduling replaces rather than duplicates. */
export function idOf(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return ((h >>> 1) % 2_000_000_000) + 10_000;
}

export interface Alert {
  key: string;
  at: Date;
  title: string;
  body: string;
  channel: Channel;
  /** Screen to open when the notification is tapped, e.g. /duaa/evening */
  route: string;
}

let lastSig = '';
/** Replaces every pending Fasl alert with this set. Fires with the app closed. */
export async function scheduleAlerts(alerts: Alert[]) {
  const sig = alerts.map((a) => `${a.key}@${a.at.getTime()}|${a.title}|${a.body}|${a.route}`).join('\n');
  if (sig === lastSig) return;
  lastSig = sig;
  try {
    if ((await notifyPermission()) !== 'granted') return;
    await ensureChannels();
    const exact = await exactAlarmsGranted();
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length) await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
    if (!alerts.length) return;
    await LocalNotifications.schedule({
      notifications: alerts.map((a) => ({
        id: idOf(a.key),
        title: a.title,
        body: a.body,
        channelId: a.channel,
        schedule: { at: a.at, allowWhileIdle: true },
        isExactNotification: exact,
        smallIcon: 'ic_stat_fasl',
        iconColor: '#C9A84C',
        autoCancel: true,
        extra: { route: a.route },
      })),
    });
  } catch {
    lastSig = '';
  }
}

let lastStatus = '';
/** The state timeline drives both the status notification (when `notify`) and the widgets. */
export async function setStatusTimeline(items: StatusItem[], notify: boolean) {
  const sig = JSON.stringify(items) + notify;
  if (sig === lastStatus) return;
  lastStatus = sig;
  try {
    await FaslNative.setStatusTimeline({ items, notify });
  } catch {
    lastStatus = '';
  }
}

export function nativeVibrate(ms: number) {
  void Haptics.vibrate({ duration: Math.max(1, ms) }).catch(() => {});
}

export function keepAwake(on: boolean) {
  void FaslNative.keepAwake({ on }).catch(() => {});
}

let lastWidget = '';
/** Sends the next days' prayer times to the home-screen widgets. */
export function setWidgetData(data: unknown) {
  const json = JSON.stringify(data);
  if (json === lastWidget) return;
  lastWidget = json;
  void FaslNative.setWidgetData({ json }).catch(() => {
    lastWidget = '';
  });
}

/**
 * Opens the screen a notification, the status bar or a widget points at.
 * Registered at start-up so taps that launched the app are not missed.
 */
export function listenForRoutes(go: (route: string) => void) {
  if (!isNative) return;
  void LocalNotifications.addListener('localNotificationActionPerformed', (a) => {
    const route = (a.notification.extra as { route?: string } | undefined)?.route;
    if (route) go(route);
  });
  const pull = () =>
    void FaslNative.consumeRoute()
      .then((r) => {
        if (r.route) go(r.route);
      })
      .catch(() => {});
  pull();
  window.addEventListener('faslroute', (e) => {
    const route = (e as Event & { route?: string }).route;
    if (route) go(route);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') pull();
  });
}
