package app.fasl.prayer;

import android.content.Intent;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static String pendingRoute;

    static synchronized String takePendingRoute() {
        String r = pendingRoute;
        pendingRoute = null;
        return r;
    }

    private static synchronized void capture(Intent intent) {
        if (intent == null) return;
        String r = intent.getStringExtra(StatusStore.EXTRA_ROUTE);
        if (r != null) {
            pendingRoute = r;
            intent.removeExtra(StatusStore.EXTRA_ROUTE);
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(FaslNativePlugin.class);
        capture(getIntent());
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        capture(intent);
        // App already running: hand the route straight to the web view.
        String r = takePendingRoute();
        if (r != null && getBridge() != null) {
            getBridge().triggerWindowJSEvent("faslroute", "{\"route\":" + org.json.JSONObject.quote(r) + "}");
        }
    }
}
