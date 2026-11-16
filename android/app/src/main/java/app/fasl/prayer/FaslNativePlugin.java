package app.fasl.prayer;

import android.view.WindowManager;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Bridge for the live status bar, the widgets, deep links and keeping the screen awake. */
@CapacitorPlugin(name = "FaslNative")
public class FaslNativePlugin extends Plugin {

    @PluginMethod
    public void setStatusTimeline(PluginCall call) {
        JSArray items = call.getArray("items");
        if (items == null) {
            call.reject("items required");
            return;
        }
        StatusStore.save(getContext(), items, Boolean.TRUE.equals(call.getBoolean("notify", true)));
        StatusStore.refresh(getContext());
        call.resolve();
    }

    @PluginMethod
    public void setWidgetData(PluginCall call) {
        String json = call.getString("json");
        if (json != null) {
            StatusStore.saveWidgetData(getContext(), json);
            WidgetUpdater.updateAll(getContext());
        }
        call.resolve();
    }

    @PluginMethod
    public void clearStatus(PluginCall call) {
        StatusStore.save(getContext(), new JSArray(), false);
        StatusStore.refresh(getContext());
        call.resolve();
    }

    /** Hands the route a notification or widget tap asked for to the web app, once. */
    @PluginMethod
    public void consumeRoute(PluginCall call) {
        JSObject r = new JSObject();
        String route = MainActivity.takePendingRoute();
        if (route != null) r.put("route", route);
        call.resolve(r);
    }

    @PluginMethod
    public void keepAwake(PluginCall call) {
        boolean on = Boolean.TRUE.equals(call.getBoolean("on", false));
        getActivity().runOnUiThread(() -> {
            if (on) getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        });
        call.resolve();
    }
}
