import { href } from '../core/router';
import { useI18n } from '../i18n';
import type { Key } from '../i18n/en';
import { IArch, IChevron, IRing, IMosque, IQadha, ISettings, IStar8 } from '../ui/Icons';
import { LanguageButton } from '../ui/LanguageButton';
import { Mark } from '../ui/Mark';

const ITEMS: { to: string; key: Key; ar: string; icon: typeof IArch; tone: string }[] = [
  { to: '/rings', key: 'nav.rings', ar: 'حلقات الأيام', icon: IRing, tone: '#C9A84C' },
  { to: '/calendar', key: 'nav.calendar', ar: 'التقويم الهجري', icon: IArch, tone: '#1D6B5E' },
  { to: '/mosques', key: 'nav.mosques', ar: 'المساجد', icon: IMosque, tone: '#D4823A' },
  { to: '/names', key: 'nav.names', ar: 'الأسماء الحسنى', icon: IStar8, tone: '#C9A84C' },
  { to: '/qadha', key: 'nav.qadha', ar: 'القضاء', icon: IQadha, tone: '#B85C3A' },
  { to: '/settings', key: 'nav.settings', ar: 'الإعدادات', icon: ISettings, tone: '#3A6EA8' },
];

export default function MorePage() {
  const { t, lang } = useI18n();
  return (
    <div className="page more">
      <header className="more-brand">
        <Mark size={64} />
        <div>
          <p className="wordmark">FASL</p>
          <p className="muted">{t('tagline')}</p>
        </div>
        <div style={{ marginInlineStart: 'auto' }}>
          <LanguageButton withLabel />
        </div>
      </header>
      <nav className="group" aria-label={t('nav.more')}>
        {ITEMS.map((x) => (
          <a key={x.to} className="row" href={href(x.to)} style={{ ['--tone' as string]: x.tone }}>
            <span className="more-icon">
              <x.icon />
            </span>
            <span className="row-main">
              <span className="row-title" style={{ display: 'block' }}>
                {t(x.key)}
              </span>
              {lang !== 'ar' && (
                <span className="row-sub ar" lang="ar" style={{ display: 'block' }}>
                  {x.ar}
                </span>
              )}
            </span>
            <IChevron className="chev flip" />
          </a>
        ))}
      </nav>
    </div>
  );
}
