import { useState } from 'react';
import { useApp } from '../core/store';
import { LANGS, useI18n } from '../i18n';
import { Seg, Sheet } from './controls';
import { ICheck, IGlobe } from './Icons';

/** One tap to change language from anywhere: a globe button that opens a language sheet. */
export function LanguageButton({ withLabel = false }: { withLabel?: boolean }) {
  const { s, set } = useApp();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.id === s.lang)!;
  return (
    <>
      <button
        className={withLabel ? 'btn btn-ghost lang-btn' : 'icon-btn lang-btn'}
        onClick={() => setOpen(true)}
        aria-label={`${t('set.appLang')} · ${current.native}`}
        title={t('set.appLang')}
      >
        <IGlobe />
        {withLabel && <span lang={current.id}>{current.native}</span>}
      </button>
      {open && (
        <Sheet title={t('set.appLang')} onClose={() => setOpen(false)} closeLabel={t('close')}>
          <div className="lang-list">
            {LANGS.map((l) => (
              <button
                key={l.id}
                className="opt"
                aria-pressed={s.lang === l.id}
                lang={l.id}
                dir={l.id === 'ar' ? 'rtl' : 'ltr'}
                onClick={() => {
                  set({ lang: l.id });
                  setOpen(false);
                }}
              >
                <span className={l.id === 'ar' ? 'opt-title ar' : 'opt-title'}>{l.native}</span>
                {l.latin !== l.native && <span className="opt-sub">{l.latin}</span>}
                {s.lang === l.id && <ICheck className="opt-check" />}
              </button>
            ))}
          </div>
          <div className="lang-num">
            <p className="caps">{t('set.numerals')}</p>
            <Seg
              label={t('set.numerals')}
              value={s.numerals === 'arab' ? 'arab' : 'latn'}
              onChange={(v) => set({ numerals: v })}
              options={[
                { v: 'latn', label: '0123' },
                { v: 'arab', label: '٠١٢٣' },
              ]}
            />
          </div>
        </Sheet>
      )}
    </>
  );
}
