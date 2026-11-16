import { useState } from 'react';
import { asrForMadhab, METHODS, suggestedMethod } from '../core/config';
import { isNative, requestNotifyPermission } from '../core/native';
import { useApp } from '../core/store';
import type { Madhab, MethodId } from '../core/types';
import { LANGS, useI18n } from '../i18n';
import type { Key } from '../i18n/en';
import { IBack, ICheck } from '../ui/Icons';
import { Mark } from '../ui/Mark';
import { LocationPicker } from './LocationPicker';

const MADHABS: { id: Madhab; ar: string }[] = [
  { id: 'maliki', ar: 'المالكي' },
  { id: 'hanafi', ar: 'الحنفي' },
  { id: 'shafii', ar: 'الشافعي' },
  { id: 'hanbali', ar: 'الحنبلي' },
  { id: 'jafari', ar: 'الجعفري' },
];

const STEPS = 4;

/** Splash → language → location → madhab → method → Today. */
export function Onboarding() {
  const { s, set } = useApp();
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<MethodId>(s.method);

  const next = () => setStep((n) => n + 1);
  const back = () => setStep((n) => Math.max(0, n - 1));

  return (
    <div className="onb">
      <div className="onb-inner" key={step}>
        {step > 0 && (
          <div className="onb-top">
            <button className="back" onClick={back}>
              <IBack />
              {t('ob.back')}
            </button>
            <span className="caps">{t('ob.step', { n: step, t: STEPS })}</span>
          </div>
        )}

        {step === 0 && (
          <div className="onb-splash">
            <Mark size={176} animate title="Fasl" />
            <p className="onb-ar ar" lang="ar">
              فَصْل
            </p>
            <p className="wordmark onb-word">FASL</p>
            <h1 className="onb-title">{t('ob.welcome')}</h1>
            <p className="onb-body">{t('ob.welcomeBody')}</p>
            <button className="btn btn-primary onb-cta" onClick={next}>
              {t('ob.begin')}
            </button>
          </div>
        )}

        {step === 1 && (
          <section aria-labelledby="ob-lang">
            <h1 id="ob-lang" className="onb-title">
              {t('ob.lang')}
            </h1>
            <div className="onb-options">
              {LANGS.map((l) => (
                <button key={l.id} className="opt" aria-pressed={s.lang === l.id} onClick={() => set({ lang: l.id })} lang={l.id} dir={l.id === 'ar' ? 'rtl' : 'ltr'}>
                  <span className={l.id === 'ar' ? 'opt-title ar' : 'opt-title'}>{l.native}</span>
                  {l.latin !== l.native && <span className="opt-sub">{l.latin}</span>}
                  {s.lang === l.id && <ICheck className="opt-check" />}
                </button>
              ))}
            </div>
            <button className="btn btn-primary onb-cta" onClick={next}>
              {t('ob.continue')}
            </button>
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="ob-loc">
            <h1 id="ob-loc" className="onb-title">
              {t('ob.location')}
            </h1>
            <p className="onb-body">{t('ob.locationWhy')}</p>
            <LocationPicker
              compact
              onPick={(p) => {
                const m = suggestedMethod(p.country);
                set({ location: p, method: m });
                setMethod(m);
                next();
              }}
            />
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="ob-mad">
            <h1 id="ob-mad" className="onb-title">
              {t('ob.madhab')}
            </h1>
            <p className="onb-body">{t('ob.madhabWhy')}</p>
            <div className="onb-options">
              {MADHABS.map((m) => (
                <button
                  key={m.id}
                  className="opt"
                  aria-pressed={s.madhab === m.id}
                  onClick={() => {
                    set({ madhab: m.id, asr: asrForMadhab(m.id) });
                    if (m.id === 'jafari') setMethod('jafari');
                  }}
                >
                  <span className="opt-title ar" lang="ar">
                    {m.ar}
                  </span>
                  {s.lang !== 'ar' && <span className="opt-sub">{t(`mad.${m.id}` as Key)}</span>}
                  {s.madhab === m.id && <ICheck className="opt-check" />}
                </button>
              ))}
            </div>
            <button className="btn btn-primary onb-cta" onClick={next}>
              {t('ob.continue')}
            </button>
          </section>
        )}

        {step === 4 && (
          <section aria-labelledby="ob-method">
            <h1 id="ob-method" className="onb-title">
              {t('ob.method')}
            </h1>
            <p className="onb-body">{t('ob.methodWhy', { c: s.lang === 'ar' && s.location.nameAr ? s.location.nameAr : s.location.name })}</p>
            <div className="onb-options onb-methods">
              {[...METHODS].filter((m) => m.id !== 'custom').sort((a, b) => (b.id === s.method ? 1 : 0) - (a.id === s.method ? 1 : 0)).map((m) => (
                <button key={m.id} className="opt opt-row" aria-pressed={method === m.id} onClick={() => setMethod(m.id)}>
                  <span>
                    <span className="opt-title">{m.name}</span>
                    <span className="opt-sub">{m.detail}</span>
                  </span>
                  {method === m.id && <ICheck className="opt-check" />}
                </button>
              ))}
            </div>
            <button className="btn btn-primary onb-cta" onClick={() => {
                set({ method, onboarded: true });
                if (isNative) void requestNotifyPermission();
              }}>
              {t('ob.done')}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
