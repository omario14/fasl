import { useMemo, useState } from 'react';
import { href } from '../core/router';
import { useApp } from '../core/store';
import { DUA_CATS, DUAS, type Dua, type DuaCat } from '../data/duas';
import { useI18n } from '../i18n';
import type { Key } from '../i18n/en';
import { BackLink } from '../ui/controls';
import { CAT_ICON, IHeart, ISearch } from '../ui/Icons';

const strip = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ًͯ-ٰٟۖ-ۭ]/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

export default function DuaaPage({ cat }: { cat?: string }) {
  const { s, data, setData } = useApp();
  const { t, digits } = useI18n();
  const [q, setQ] = useState('');
  const saved = cat === 'saved';
  const category = DUA_CATS.find((c) => c.id === cat);

  const list = useMemo(() => {
    const nq = strip(q.trim());
    let l = DUAS;
    if (saved) l = l.filter((d) => data.bookmarks.includes(d.id));
    else if (category) l = l.filter((d) => d.cat === category.id);
    if (nq) l = l.filter((d) => [d.ar, d.tr, d.en, d.fr, d.tk ?? ''].some((x) => strip(x).includes(nq)));
    return l;
  }, [q, saved, category, data.bookmarks]);

  const toggle = (id: number) =>
    setData((d) => ({ bookmarks: d.bookmarks.includes(id) ? d.bookmarks.filter((x) => x !== id) : [...d.bookmarks, id] }));

  const showGrid = !cat && !q.trim();

  return (
    <div className="page duaa">
      {cat && <BackLink to={href('/duaa')} label={t('duaa.all')} />}
      <header className="page-head">
        <div>
          <h1 className="page-title">{saved ? t('duaa.saved') : category ? t(`cat.${category.id}` as Key) : t('duaa.title')}</h1>
          {category && (
            <p className="page-sub ar" lang="ar" style={{ fontSize: 20 }}>
              {category.ar}
            </p>
          )}
        </div>
        {!cat && (
          <a className="btn btn-ghost" href={href('/duaa/saved')}>
            <IHeart filled={data.bookmarks.length > 0} />
            {t('duaa.saved')} · {digits(data.bookmarks.length)}
          </a>
        )}
      </header>

      <div className="search duaa-search">
        <ISearch />
        <label className="sr-only" htmlFor="duaa-q">
          {t('duaa.search')}
        </label>
        <input id="duaa-q" className="field" type="search" placeholder={t('duaa.search')} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {showGrid ? (
        <div className="cat-grid">
          {DUA_CATS.map((c) => {
            const Icon = CAT_ICON[c.id];
            const n = DUAS.filter((d) => d.cat === c.id).length;
            return (
              <a key={c.id} className="cat card" href={href(`/duaa/${c.id}`)}>
                <span className="cat-icon">
                  <Icon />
                </span>
                <span className="cat-ar ar" lang="ar">
                  {c.ar}
                </span>
                {s.lang !== 'ar' && <span className="cat-name">{t(`cat.${c.id}` as Key)}</span>}
                <span className="cat-count caps">{t('duaa.count', { n })}</span>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="dua-list">
          {list.length === 0 && <p className="empty">{saved && !q ? t('duaa.noSaved') : t('duaa.none', { q })}</p>}
          {list.map((d) => (
            <DuaCard key={d.id} d={d} saved={data.bookmarks.includes(d.id)} onToggle={() => toggle(d.id)} showCat={!category} />
          ))}
        </div>
      )}
    </div>
  );
}

function DuaCard({ d, saved, onToggle, showCat }: { d: Dua; saved: boolean; onToggle: () => void; showCat: boolean }) {
  const { s } = useApp();
  const { t, digits } = useI18n();
  const translation = s.lang === 'fr' ? d.fr : s.lang === 'tr' ? (d.tk ?? d.en) : s.lang === 'ar' ? null : d.en;
  return (
    <article className="dua card">
      <div className="dua-top">
        <span className="caps">
          {showCat && <>{t(`cat.${d.cat as DuaCat}` as Key)} · </>}
          {d.repeat && d.repeat > 1 ? t('duaa.repeat', { n: d.repeat }) : null}
        </span>
        <button className={`icon-btn heart ${saved ? 'on' : ''}`} aria-pressed={saved} aria-label={saved ? t('duaa.unsave') : t('duaa.save')} onClick={onToggle}>
          <IHeart filled={saved} />
        </button>
      </div>
      <p className="dua-ar ar" lang="ar">
        {d.ar}
      </p>
      <p className="dua-tr" lang="ar-Latn">
        {d.tr}
      </p>
      {translation && <p className="dua-en">{translation}</p>}
      <p className="dua-src caps">{s.lang === 'ar' ? digits(d.src) : d.src}</p>
    </article>
  );
}
