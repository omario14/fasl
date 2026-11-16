import { useMemo } from 'react';
import { useApp } from '../core/store';
import { hm } from '../core/time';
import type { Lang, Settings } from '../core/types';
import { ar } from './ar';
import { en, type Key } from './en';
import { fr } from './fr';
import { tr } from './tr';

const DICTS: Record<Lang, Partial<Record<Key, string>>> = { en, ar, fr, tr };

export const LANGS: { id: Lang; native: string; latin: string }[] = [
  { id: 'ar', native: 'العربية', latin: 'Arabic' },
  { id: 'fr', native: 'Français', latin: 'French' },
  { id: 'en', native: 'English', latin: 'English' },
  { id: 'tr', native: 'Türkçe', latin: 'Turkish' },
];

export type Vars = Record<string, string | number>;

const ARAB_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export const toArabDigits = (s: string) => s.replace(/[0-9]/g, (d) => ARAB_DIGITS[+d]);

export function makeI18n(s: Pick<Settings, 'lang' | 'numerals' | 'clock'>, tz: string) {
  const lang = s.lang;
  // Western (Arabic) digits 0123 by default in every language; Eastern ٠١٢٣ only when chosen.
  const arab = s.numerals === 'arab';
  const digits = (v: string | number) => (arab ? toArabDigits(String(v)) : String(v));
  const locale = `${lang === 'ar' ? 'ar-TN' : lang === 'fr' ? 'fr-FR' : lang === 'tr' ? 'tr-TR' : 'en-GB'}-u-nu-${arab ? 'arab' : 'latn'}`;

  const t = (key: Key, vars?: Vars) => {
    let str: string = DICTS[lang][key] ?? en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replaceAll(`{${k}}`, typeof v === 'number' ? digits(v) : v);
      }
    }
    return str;
  };

  let timeFmt: Intl.DateTimeFormat;
  try {
    timeFmt = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: s.clock === '12', timeZone: tz });
  } catch {
    timeFmt = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: s.clock === '12' });
  }
  const time = (d: Date) => timeFmt.format(d);

  const dur = (ms: number) => {
    const { h, m } = hm(ms);
    if (h === 0) return t('dur.m', { m });
    if (m === 0) return t('dur.h', { h });
    return t('dur.hm', { h, m });
  };

  /** Compact clock-style countdown, e.g. 1:42 or 0:08:31 when under an hour. */
  const countdown = (ms: number) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const sec = total % 60;
    const s2 = (n: number) => String(n).padStart(2, '0');
    return digits(h > 0 ? `${h}:${s2(m)}` : `${m}:${s2(sec)}`);
  };

  const num = (n: number, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, opts).format(n);

  const gregDate = (y: number, m: number, d: number, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) =>
    new Intl.DateTimeFormat(locale, { ...opts, timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d, 12)));

  return { t, time, dur, countdown, num, digits, gregDate, lang, locale, arab };
}

export type I18n = ReturnType<typeof makeI18n>;

export function useI18n(): I18n {
  const { s, tz } = useApp();
  return useMemo(() => makeI18n(s, tz), [s.lang, s.numerals, s.clock, tz]); // eslint-disable-line react-hooks/exhaustive-deps
}
