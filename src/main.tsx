import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { isNative, listenForRoutes } from './core/native';
import { go } from './core/router';
import { AppProvider } from './core/store';
// Fonts ship inside the app so it looks right offline (no Google Fonts request).
import '@fontsource/amiri/400.css';
import '@fontsource/amiri/700.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/noto-naskh-arabic/400.css';
import '@fontsource/noto-naskh-arabic/500.css';
import '@fontsource/noto-naskh-arabic/600.css';
import './styles.css';
import './features/features.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);

// Offline shell + system notifications. Registered after load so it never delays first paint.

if (isNative) {
  // The installed app ships its files locally; no service worker needed.
  // Taps on notifications, the status bar and widgets open the screen they point at.
  listenForRoutes(go);
} else if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
} else if ('serviceWorker' in navigator) {
  // dev: still register so pinned notifications can be tested on localhost
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
