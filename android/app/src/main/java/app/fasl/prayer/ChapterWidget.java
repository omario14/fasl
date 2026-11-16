package app.fasl.prayer;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/** 2×2 widget: the chapter you are in, its state and a live countdown. */
public class ChapterWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        StatusStore.refresh(ctx);
    }
}
