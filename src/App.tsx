import { lazy, Suspense, type ReactNode } from 'react';
import { useAlerts } from './core/alerts';
import { href, match, useRoute } from './core/router';
import { useApp } from './core/store';
import { PRAYERS, type PrayerId } from './core/types';
import { Dashboard } from './features/Dashboard';
import { Onboarding } from './features/Onboarding';
import { PrayerDetail } from './features/PrayerDetail';
import { useI18n } from './i18n';
import type { Key } from './i18n/en';
import { IArch, IBeads, IRing, ICompass, IFlower, IMore, IMosque, IQadha, ISettings, IStar8, IToday } from './ui/Icons';
import { Mark } from './ui/Mark';
import { StatusBar } from './ui/StatusBar';
import { Toasts } from './ui/toast';

const Qibla = lazy(() => import('./features/Qibla'));
const Duaa = lazy(() => import('./features/Duaa'));
const Tasbih = lazy(() => import('./features/Tasbih'));
const Calendar = lazy(() => import('./features/Calendar'));
const Mosques = lazy(() => import('./features/Mosques'));
const Names = lazy(() => import('./features/Names'));
const Qadha = lazy(() => import('./features/Qadha'));
const Settings = lazy(() => import('./features/Settings'));
const More = lazy(() => import('./features/More'));
const Rings = lazy(() => import('./features/Rings'));

type NavItem = { to: string; key: Key; icon: (p: { className?: string }) => ReactNode };
const PRIMARY: NavItem[] = [
  { to: '/', key: 'nav.today', icon: IToday },
  { to: '/qibla', key: 'nav.qibla', icon: ICompass },
  { to: '/duaa', key: 'nav.duaa', icon: IFlower },
  { to: '/tasbih', key: 'nav.tasbih', icon: IBeads },
];
const SECONDARY: NavItem[] = [
  { to: '/rings', key: 'nav.rings', icon: IRing },
  { to: '/calendar', key: 'nav.calendar', icon: IArch },
  { to: '/mosques', key: 'nav.mosques', icon: IMosque },
  { to: '/names', key: 'nav.names', icon: IStar8 },
  { to: '/qadha', key: 'nav.qadha', icon: IQadha },
];

function isCurrent(path: string, to: string) {
  if (to === '/') return path === '/' || path.startsWith('/prayer');
  return path === to || path.startsWith(to + '/');
}

function Routes({ path }: { path: string }) {
  let m: Record<string, string> | null;
  if (path === '/') return <Dashboard />;
  if ((m = match(path, '/prayer/:id')) && PRAYERS.includes(m.id as PrayerId)) return <PrayerDetail id={m.id as PrayerId} />;
  if (path === '/qibla') return <Qibla />;
  if (path === '/duaa') return <Duaa />;
  if ((m = match(path, '/duaa/:cat'))) return <Duaa cat={m.cat} />;
  if (path === '/tasbih') return <Tasbih />;
  if (path === '/calendar') return <Calendar />;
  if (path === '/mosques') return <Mosques />;
  if (path === '/names') return <Names />;
  if (path === '/qadha') return <Qadha />;
  if (path === '/settings') return <Settings />;
  if (path === '/more') return <More />;
  if (path === '/rings') return <Rings />;
  return <Dashboard />;
}

export default function App() {
  const { s } = useApp();
  const { t } = useI18n();
  const path = useRoute();
  useAlerts();

  if (!s.onboarded) return <Onboarding />;

  const moreActive = ['/more', '/settings', ...SECONDARY.map((n) => n.to)].some((p) => isCurrent(path, p));

  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <nav className="sidebar" aria-label="Fasl">
        <a className="side-brand" href={href('/')} aria-label="Fasl — فَصْل">
          <Mark size={40} />
          <span className="wordmark">
            FASL
            <small>{t('tagline')}</small>
          </span>
        </a>
        {[...PRIMARY, ...SECONDARY].map((n) => (
          <a key={n.to} className="side-link" href={href(n.to)} aria-current={isCurrent(path, n.to) ? 'page' : undefined} title={t(n.key)}>
            <n.icon />
            <span>{t(n.key)}</span>
          </a>
        ))}
        <div className="side-spacer" />
        <a className="side-link" href={href('/settings')} aria-current={isCurrent(path, '/settings') ? 'page' : undefined} title={t('nav.settings')}>
          <ISettings />
          <span>{t('nav.settings')}</span>
        </a>
      </nav>

      <div className="main">
        <StatusBar />
        <main id="main" tabIndex={-1} key={path}>
          <Suspense fallback={<div className="page" aria-busy="true" />}>
            <Routes path={path} />
          </Suspense>
        </main>
      </div>

      <nav className="tabbar" aria-label="Fasl">
        {PRIMARY.map((n) => (
          <a key={n.to} className="tab" href={href(n.to)} aria-current={isCurrent(path, n.to) ? 'page' : undefined}>
            <n.icon />
            {t(n.key)}
          </a>
        ))}
        <a className="tab" href={href('/more')} aria-current={moreActive ? 'page' : undefined}>
          <IMore />
          {t('nav.more')}
        </a>
      </nav>
      <Toasts />
    </div>
  );
}
