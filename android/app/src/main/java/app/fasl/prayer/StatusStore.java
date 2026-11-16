package app.fasl.prayer;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * The persistent status bar (SOP §3) and the widgets' clock. A timeline of states computed by the
 * app is stored here; the current one is posted as a silent, ongoing notification with a native
 * countdown, the widgets are redrawn, and an alarm is armed for the next state change so both keep
 * themselves current while Fasl is closed.
 */
public final class StatusStore {
    static final String CHANNEL = "fasl-status";
    static final int NOTIFICATION_ID = 7001;
    static final String EXTRA_ROUTE = "fasl_route";
    private static final String PREFS = "fasl-status";
    private static final String KEY = "items";
    private static final String KEY_NOTIFY = "notify";
    private static final String KEY_WIDGET = "widget";
    private static final int ALARM_REQUEST = 7002;

    private StatusStore() {}

    static SharedPreferences prefs(Context ctx) {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static void save(Context ctx, JSONArray items, boolean notify) {
        prefs(ctx).edit().putString(KEY, items.toString()).putBoolean(KEY_NOTIFY, notify).apply();
    }

    static void saveWidgetData(Context ctx, String json) {
        prefs(ctx).edit().putString(KEY_WIDGET, json).apply();
    }

    static JSONObject widgetData(Context ctx) {
        try {
            String raw = prefs(ctx).getString(KEY_WIDGET, null);
            return raw == null ? null : new JSONObject(raw);
        } catch (Exception e) {
            return null;
        }
    }

    /** The timeline entry that applies right now, or null before the app has run once. */
    static JSONObject current(Context ctx) {
        String raw = prefs(ctx).getString(KEY, null);
        if (raw == null) return null;
        try {
            JSONArray items = new JSONArray(raw);
            long now = System.currentTimeMillis();
            JSONObject cur = null;
            for (int i = 0; i < items.length(); i++) {
                JSONObject it = items.getJSONObject(i);
                if (it.getLong("at") <= now) cur = it;
                else break;
            }
            return cur;
        } catch (Exception e) {
            return null;
        }
    }

    private static long nextChange(Context ctx) {
        String raw = prefs(ctx).getString(KEY, null);
        if (raw == null) return -1;
        try {
            JSONArray items = new JSONArray(raw);
            long now = System.currentTimeMillis();
            for (int i = 0; i < items.length(); i++) {
                long at = items.getJSONObject(i).getLong("at");
                if (at > now) return at;
            }
        } catch (Exception ignored) {
        }
        return -1;
    }

    /** Posts (or removes) the status notification, redraws widgets, arms the next change. */
    static void refresh(Context ctx) {
        JSONObject cur = current(ctx);
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        try {
            if (cur != null && prefs(ctx).getBoolean(KEY_NOTIFY, true)) post(ctx, nm, cur);
            else nm.cancel(NOTIFICATION_ID);
        } catch (Exception ignored) {
        }
        WidgetUpdater.updateAll(ctx);
        long next = nextChange(ctx);
        if (next > 0) arm(ctx, next);
    }

    static PendingIntent openApp(Context ctx, String route, int requestCode) {
        Intent open = new Intent(ctx, MainActivity.class)
                .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP)
                .putExtra(EXTRA_ROUTE, route == null ? "/" : route);
        return PendingIntent.getActivity(ctx, requestCode, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static void post(Context ctx, NotificationManager nm, JSONObject it) throws Exception {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && nm.getNotificationChannel(CHANNEL) == null) {
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Live prayer status", NotificationManager.IMPORTANCE_LOW);
            ch.setDescription("The always-on bar showing which prayer window you are in");
            ch.setShowBadge(false);
            ch.enableVibration(false);
            ch.setSound(null, null);
            nm.createNotificationChannel(ch);
        }
        long until = it.optLong("until", 0);
        NotificationCompat.Builder b = new NotificationCompat.Builder(ctx, CHANNEL)
                .setSmallIcon(R.drawable.ic_stat_fasl)
                .setContentTitle(it.getString("title"))
                .setContentText(it.getString("body"))
                .setColor(Color.parseColor(it.optString("color", "#C9A84C")))
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setShowWhen(until > 0)
                .setCategory(NotificationCompat.CATEGORY_STATUS)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setContentIntent(openApp(ctx, it.optString("route", "/"), 100));
        if (until > 0) {
            // Android draws a live countdown to `until` — the bar ticks without the app running.
            b.setWhen(until).setUsesChronometer(true).setChronometerCountDown(true);
        }
        nm.notify(NOTIFICATION_ID, b.build());
    }

    private static PendingIntent alarmIntent(Context ctx) {
        Intent i = new Intent(ctx, StatusReceiver.class).setAction(StatusReceiver.ACTION_TICK);
        return PendingIntent.getBroadcast(ctx, ALARM_REQUEST, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static void arm(Context ctx, long at) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pi = alarmIntent(ctx);
        boolean exact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || am.canScheduleExactAlarms();
        if (exact) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
    }
}
