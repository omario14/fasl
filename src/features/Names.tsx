import { useMemo, useState } from 'react';
import { useApp } from '../core/store';
import { NAMES } from '../data/names';
import { useI18n } from '../i18n';
import { ISearch } from '../ui/Icons';

const strip = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ًͯ-ٰٟʿʾ'’-]/g, '').replace(/[إأآٱ]/g, 'ا');

export default function NamesPage() {
  const { s } = useApp();
  const { t, digits } = useI18n();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const n = strip(q.trim());
    return NAMES.map((x, k) => ({ x, k })).filter(({ x }) => !n || x.some((v) => strip(v).includes(n)));
  }, [q]);
  return (
    <div className="page names">
      <header className="page-head">
        <div>
          <h1 className="page-title">{t('names.title')}</h1>
          <p className="page-sub">
            {t('names.sub')} · <span className="ar" lang="ar">الأسماء الحسنى</span>
          </p>
        </div>
      </header>
      <div className="search duaa-search">
        <ISearch />
        <label className="sr-only" htmlFor="names-q">
          {t('names.search')}
        </label>
        <input id="names-q" className="field" type="search" placeholder={t('names.search')} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <ol className="names-grid">
        {list.map(({ x, k }) => (
          <li key={k} className="name card">
            <span className="name-n num">{digits(k + 1)}</span>
            <span className="name-ar ar" lang="ar">
              {x[0]}
            </span>
            <span className="name-tr">{x[1]}</span>
            {s.lang !== 'ar' && <span className="name-mean">{s.lang === 'fr' ? x[3] : x[2]}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
