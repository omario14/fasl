package app.fasl.prayer;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Typeface;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Draws the day ring for widgets: five arcs (Fajr at the top, clockwise), filled in the
 * prayer's colour when marked prayed, tinted while running, dotted once missed.
 */
final class RingRenderer {
    private static final int TRACK = Color.argb(30, 239, 232, 216);
    private static final int MISSED = Color.argb(44, 239, 232, 216);
    private static final int GOLD = Color.parseColor("#C9A84C");
    private static final int FAINT = Color.parseColor("#5F7D68");
    private static final float GAP = 9f;

    private RingRenderer() {}

    static Bitmap render(JSONArray spans, int sizePx, long now) {
        Bitmap bmp = Bitmap.createBitmap(sizePx, sizePx, Bitmap.Config.ARGB_8888);
        Canvas c = new Canvas(bmp);
        float s = sizePx / 100f;
        float r = 38 * s;
        RectF oval = new RectF(50 * s - r, 50 * s - r, 50 * s + r, 50 * s + r);
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        p.setStyle(Paint.Style.STROKE);
        p.setStrokeCap(Paint.Cap.ROUND);
        p.setStrokeWidth(9 * s);

        int prayed = 0;
        for (int i = 0; i < 5 && i < spans.length(); i++) {
            JSONObject sp = spans.optJSONObject(i);
            if (sp == null) continue;
            int color;
            try {
                color = Color.parseColor(sp.optString("color", "#C9A84C"));
            } catch (Exception e) {
                color = GOLD;
            }
            boolean isPrayed = sp.optBoolean("prayed", false);
            long adhan = sp.optLong("adhan", 0);
            long end = sp.optLong("end", 0);
            float start = -90f + i * 72f + GAP / 2f;
            float sweep = 72f - GAP;
            p.setPathEffect(null);
            if (isPrayed) {
                prayed++;
                p.setColor(color);
            } else if (adhan <= now && now < end) {
                p.setColor(Color.argb(110, Color.red(color), Color.green(color), Color.blue(color)));
            } else if (end <= now) {
                p.setColor(MISSED);
                p.setPathEffect(new DashPathEffect(new float[] {1.5f * s, 4.5f * s}, 0));
            } else {
                p.setColor(TRACK);
            }
            c.drawArc(oval, start, sweep, false, p);
        }

        boolean complete = prayed == 5;
        Paint dot = new Paint(Paint.ANTI_ALIAS_FLAG);
        dot.setColor(GOLD);
        dot.setAlpha(complete ? 255 : 115);
        for (int i = 0; i < 5; i++) {
            double a = Math.toRadians(i * 72 - 90);
            c.drawCircle((float) (50 * s + r * Math.cos(a)), (float) (50 * s + r * Math.sin(a)), 3.4f * s, dot);
        }

        Paint text = new Paint(Paint.ANTI_ALIAS_FLAG);
        text.setTextAlign(Paint.Align.CENTER);
        text.setTypeface(Typeface.create(Typeface.SERIF, Typeface.BOLD));
        if (complete) {
            text.setColor(GOLD);
            text.setTextSize(44 * s);
            c.drawText("ف", 50 * s, 64 * s, text);
        } else {
            text.setColor(prayed > 0 ? GOLD : FAINT);
            text.setTextSize(30 * s);
            c.drawText(String.valueOf(prayed), 50 * s, 61 * s, text);
        }
        return bmp;
    }
}
