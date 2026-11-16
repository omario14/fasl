package app.fasl.prayer;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.graphics.Color;
import android.os.SystemClock;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

/** Draws both home-screen widgets from the stored status timeline and prayer times. */
public final class WidgetUpdater {
    private static final int SAGE = Color.parseColor("#8BAF96");
    private static final int INK = Color.parseColor("#EFE8D8");
    private static final int FAINT = Color.parseColor("#5F7D68");

    private static final int[] COL = {R.id.col0, R.id.col1, R.id.col2, R.id.col3, R.id.col4};
    private static final int[] NAME = {R.id.name0, R.id.name1, R.id.name2, R.id.name3, R.id.name4};
    private static final int[] TIME = {R.id.time0, R.id.time1, R.id.time2, R.id.time3, R.id.time4};
    private static final int[] DOT = {R.id.dot0, R.id.dot1, R.id.dot2, R.id.dot3, R.id.dot4};

    private WidgetUpdater() {}

    static void updateAll(Context ctx) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        for (int id : mgr.getAppWidgetIds(new ComponentName(ctx, ChapterWidget.class))) {
            mgr.updateAppWidget(id, chapter(ctx));
        }
        for (int id : mgr.getAppWidgetIds(new ComponentName(ctx, DayWidget.class))) {
            mgr.updateAppWidget(id, day(ctx));
        }
    }

    /** Fills the shared header: stripe, prayer name, state label, live countdown, end time. */
    private static void header(Context ctx, RemoteViews v) {
        JSONObject cur = StatusStore.current(ctx);
        if (cur == null) {
            v.setTextViewText(R.id.w_name, "فَصْل");
            v.setTextViewText(R.id.w_label, "Open Fasl once to start");
            v.setViewVisibility(R.id.w_count, View.GONE);
            v.setTextViewText(R.id.w_until, "");
            v.setOnClickPendingIntent(R.id.w_root, StatusStore.openApp(ctx, "/", 200));
            return;
        }
        int state = parse(cur.optString("color"), SAGE);
        v.setTextViewText(R.id.w_name, cur.optString("prayer"));
        v.setTextColor(R.id.w_name, parse(cur.optString("prayerColor"), INK));
        v.setTextViewText(R.id.w_label, cur.optString("label"));
        v.setTextColor(R.id.w_label, state);
        v.setInt(R.id.w_stripe, "setColorFilter", state);
        v.setTextViewText(R.id.w_until, cur.optString("untilLabel"));
        long until = cur.optLong("until", 0);
        if (until > System.currentTimeMillis()) {
            long base = SystemClock.elapsedRealtime() + (until - System.currentTimeMillis());
            v.setViewVisibility(R.id.w_count, View.VISIBLE);
            v.setChronometer(R.id.w_count, base, null, true);
            v.setChronometerCountDown(R.id.w_count, true);
        } else {
            v.setViewVisibility(R.id.w_count, View.GONE);
        }
        v.setOnClickPendingIntent(R.id.w_root, StatusStore.openApp(ctx, cur.optString("route", "/"), 201));
    }

    /** The day holding the running prayer, or else the next one. */
    static JSONObject shownDay(JSONObject data, long now) {
        try {
            JSONArray days = data.getJSONArray("days");
            for (int d = 0; d < days.length(); d++) {
                JSONArray spans = days.getJSONObject(d).getJSONArray("spans");
                for (int k = 0; k < spans.length(); k++) {
                    if (spans.getJSONObject(k).getLong("end") > now) return days.getJSONObject(d);
                }
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    /** Draws today's day ring into the widget's ring slot. */
    private static void ring(Context ctx, RemoteViews v) {
        JSONObject data = StatusStore.widgetData(ctx);
        if (data == null) return;
        long now = System.currentTimeMillis();
        JSONObject show = shownDay(data, now);
        if (show == null) return;
        int px = Math.round(56 * ctx.getResources().getDisplayMetrics().density);
        v.setImageViewBitmap(R.id.w_ring, RingRenderer.render(show.optJSONArray("spans"), px, now));
        v.setViewVisibility(R.id.w_ring, View.VISIBLE);
        v.setOnClickPendingIntent(R.id.w_ring, StatusStore.openApp(ctx, "/rings", 220));
    }

    static RemoteViews chapter(Context ctx) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_chapter);
        header(ctx, v);
        ring(ctx, v);
        return v;
    }

    static RemoteViews day(Context ctx) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_day);
        header(ctx, v);
        ring(ctx, v);
        JSONObject data = StatusStore.widgetData(ctx);
        if (data == null) return v;
        try {
            long now = System.currentTimeMillis();
            JSONObject show = shownDay(data, now);
            if (show == null) return v;
            boolean rtl = data.optBoolean("rtl", false);
            JSONArray spans = show.getJSONArray("spans");
            boolean focusTaken = false;
            for (int k = 0; k < 5 && k < spans.length(); k++) {
                JSONObject sp = spans.getJSONObject(k);
                int slot = rtl ? 4 - k : k;
                long adhan = sp.getLong("adhan");
                long end = sp.getLong("end");
                int color = parse(sp.optString("color"), INK);
                boolean active = adhan <= now && now < end;
                boolean past = end <= now;
                boolean next = !active && !past && !focusTaken;
                if (active || next) focusTaken = true;
                v.setTextViewText(NAME[slot], sp.optString("ar"));
                v.setTextViewText(TIME[slot], sp.optString("time"));
                v.setTextColor(NAME[slot], past ? FAINT : color);
                v.setTextColor(TIME[slot], past ? FAINT : INK);
                v.setInt(DOT[slot], "setColorFilter", color);
                v.setViewVisibility(DOT[slot], active ? View.VISIBLE : View.INVISIBLE);
                v.setInt(COL[slot], "setBackgroundResource", active ? R.drawable.widget_cell_active : (next ? R.drawable.widget_cell_next : 0));
                v.setOnClickPendingIntent(COL[slot], StatusStore.openApp(ctx, "/prayer/" + sp.optString("id"), 210 + k));
            }
            v.setTextViewText(R.id.w_foot, show.optString("hijri") + "  ·  " + data.optString("place"));
        } catch (Exception ignored) {
        }
        return v;
    }

    private static int parse(String c, int fallback) {
        try {
            return Color.parseColor(c);
        } catch (Exception e) {
            return fallback;
        }
    }
}
