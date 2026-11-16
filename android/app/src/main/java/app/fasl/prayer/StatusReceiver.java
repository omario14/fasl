package app.fasl.prayer;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Wakes at each state change (and after reboot or an app update) to refresh the status bar. */
public class StatusReceiver extends BroadcastReceiver {
    static final String ACTION_TICK = "app.fasl.prayer.STATUS_TICK";

    @Override
    public void onReceive(Context context, Intent intent) {
        StatusStore.refresh(context);
    }
}
