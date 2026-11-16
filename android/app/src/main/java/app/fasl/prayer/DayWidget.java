package app.fasl.prayer;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/** 4×2 widget: the live chapter plus today's five prayer times. */
public class DayWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        StatusStore.refresh(ctx);
    }
}
