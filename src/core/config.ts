import { CalculationMethod, CalculationParameters } from 'adhan';
import type { MethodId, PrayerId, Settings, Urgency, VoiceId, Madhab } from './types';

/** Calculation methods. Angles in degrees below the horizon. */
export const METHODS: { id: MethodId; name: string; detail: string }[] = [
  { id: 'mwl', name: 'Muslim World League', detail: 'Fajr 18° · Isha 17°' },
  { id: 'isna', name: 'ISNA · North America', detail: 'Fajr 15° · Isha 15°' },
  { id: 'egypt', name: 'Egyptian General Authority of Survey', detail: 'Fajr 19.5° · Isha 17.5°' },
  { id: 'ummalqura', name: 'Umm Al-Qura University, Makkah', detail: 'Fajr 18.5° · Isha 90 min' },
  { id: 'karachi', name: 'University of Islamic Sciences, Karachi', detail: 'Fajr 18° · Isha 18°' },
  { id: 'tehran', name: 'Institute of Geophysics, Tehran', detail: 'Fajr 17.7° · Isha 14° · Maghrib 4.5°' },
  { id: 'jafari', name: 'Shia Ithna Ashari · Jafari', detail: 'Fajr 16° · Isha 14° · Maghrib 4°' },
  { id: 'turkey', name: 'Diyanet İşleri Başkanlığı, Türkiye', detail: 'Fajr 18° · Isha 17°' },
  { id: 'tunisia', name: 'Ministry of Religious Affairs, Tunisia', detail: 'Fajr 18° · Isha 18°' },
  { id: 'algeria', name: 'Ministry of Religious Affairs, Algeria', detail: 'Fajr 18° · Isha 17°' },
  { id: 'morocco', name: 'Ministry of Habous, Morocco', detail: 'Fajr 19° · Isha 17°' },
  { id: 'france', name: 'UOIF · France', detail: 'Fajr 12° · Isha 12°' },
  { id: 'dubai', name: 'Dubai · UAE', detail: 'Fajr 18.2° · Isha 18.2°' },
  { id: 'kuwait', name: 'Kuwait', detail: 'Fajr 18° · Isha 17.5°' },
  { id: 'qatar', name: 'Qatar', detail: 'Fajr 18° · Isha 90 min' },
  { id: 'singapore', name: 'MUIS · Singapore', detail: 'Fajr 20° · Isha 18°' },
  { id: 'moonsighting', name: 'Moonsighting Committee', detail: 'Fajr 18° · Isha 18° · seasonal' },
  { id: 'custom', name: 'Custom angles', detail: 'Your own Fajr and Isha angles' },
];

export function methodParams(s: Pick<Settings, 'method' | 'customFajr' | 'customIsha'>): CalculationParameters {
  switch (s.method) {
    case 'mwl': return CalculationMethod.MuslimWorldLeague();
    case 'isna': return CalculationMethod.NorthAmerica();
    case 'egypt': return CalculationMethod.Egyptian();
    case 'ummalqura': return CalculationMethod.UmmAlQura();
    case 'karachi': return CalculationMethod.Karachi();
    case 'tehran': return CalculationMethod.Tehran();
    case 'turkey': return CalculationMethod.Turkey();
    case 'dubai': return CalculationMethod.Dubai();
    case 'kuwait': return CalculationMethod.Kuwait();
    case 'qatar': return CalculationMethod.Qatar();
    case 'singapore': return CalculationMethod.Singapore();
    case 'moonsighting': return CalculationMethod.MoonsightingCommittee();
    case 'jafari': {
      const p = new CalculationParameters('Other', 16, 14, 0, 4);
      return p;
    }
    case 'tunisia': return new CalculationParameters('Other', 18, 18);
    case 'algeria': {
      const p = new CalculationParameters('Other', 18, 17);
      p.methodAdjustments.maghrib = 3;
      return p;
    }
    case 'morocco': {
      const p = new CalculationParameters('Other', 19, 17);
      p.methodAdjustments.dhuhr = 5;
      p.methodAdjustments.maghrib = 5;
      return p;
    }
    case 'france': return new CalculationParameters('Other', 12, 12);
    case 'custom': return new CalculationParameters('Other', s.customFajr, s.customIsha);
  }
}

/** The method most mosques use in a given country (ISO 3166 alpha-2). */
export function suggestedMethod(country?: string): MethodId {
  switch (country) {
    case 'TN': return 'tunisia';
    case 'DZ': return 'algeria';
    case 'MA': return 'morocco';
    case 'EG': case 'LY': case 'SD': return 'egypt';
    case 'SA': case 'YE': return 'ummalqura';
    case 'TR': case 'AZ': return 'turkey';
    case 'PK': case 'IN': case 'BD': case 'AF': return 'karachi';
    case 'IR': return 'tehran';
    case 'US': case 'CA': return 'isna';
    case 'FR': case 'BE': return 'france';
    case 'AE': return 'dubai';
    case 'KW': return 'kuwait';
    case 'QA': return 'qatar';
    case 'SG': case 'MY': case 'ID': return 'singapore';
    case 'GB': return 'moonsighting';
    default: return 'mwl';
  }
}

export function asrForMadhab(m: Madhab) {
  return m === 'hanafi' ? 'hanafi' : 'standard';
}

export const PRAYER_COLOR: Record<PrayerId, string> = {
  fajr: '#3A6EA8',
  dhuhr: '#C9A84C',
  asr: '#D4823A',
  maghrib: '#B85C3A',
  isha: '#1D6B5E',
};

/** Isha teal is too dark to read as text on Forest Night; a lifted tone for type and strokes. */
export const PRAYER_INK: Record<PrayerId, string> = {
  fajr: '#6E9CD3',
  dhuhr: '#D8B85E',
  asr: '#E3994F',
  maghrib: '#D47A55',
  isha: '#3FA08E',
};
export const PRAYER_INK_LIGHT: Record<PrayerId, string> = {
  fajr: '#2F5F96',
  dhuhr: '#8A6D1F',
  asr: '#A65A1A',
  maghrib: '#9A4527',
  isha: '#17594E',
};

export const URGENCY_COLOR: Record<Urgency, string> = {
  calm: '#4A7A5A',
  approaching: '#1D9E75',
  preferred: '#4FC8A0',
  permissible: '#1D9E75',
  obligation: '#D4823A',
  urgent: '#C0392B',
  makrooh: '#7A7A7A',
};

export const PRAYER_AR: Record<PrayerId, string> = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

export const PRAYER_LATIN: Record<PrayerId, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export const VOICES: { id: VoiceId; name: string }[] = [
  { id: 'makkah', name: 'Masjid al-Haram, Makkah' },
  { id: 'madinah', name: 'Masjid an-Nabawi, Madinah' },
  { id: 'alafasy', name: 'Mishary Rashid Al-Afasy' },
  { id: 'abdulbasit', name: 'Abdul Basit Abdus Samad' },
  { id: 'minshawi', name: 'Muhammad Siddiq Al-Minshawi' },
  { id: 'tunisian', name: 'Tunisian · Zitouna' },
];

export const MAKKAH = { lat: 21.422487, lng: 39.826206 };

export const DEFAULT_SETTINGS: Settings = {
  onboarded: false,
  lang: 'en',
  numerals: 'auto',
  clock: '24',
  datePrimary: 'hijri',
  theme: 'dark',
  method: 'tunisia',
  customFajr: 18,
  customIsha: 17,
  madhab: 'maliki',
  asr: 'standard',
  highLat: 'angle',
  offsets: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
  hijriOffset: 0,
  location: { mode: 'city', lat: 36.8065, lng: 10.1815, name: 'Tunis', nameAr: 'تونس', country: 'TN', tz: 'Africa/Tunis' },
  tzMode: 'auto',
  notify: {
    master: true,
    statusBar: true,
    systemPin: false,
    vibration: true,
    volume: 0.8,
    ramp: true,
    duaAfterAdhan: false,
    fajrVariant: true,
    perPrayer: {
      fajr: { on: true, sound: 'adhan', voice: 'makkah', preferredEnd: true, obligation: true, makrooh: true },
      dhuhr: { on: true, sound: 'chime', voice: 'makkah', preferredEnd: true, obligation: true, makrooh: true },
      asr: { on: true, sound: 'chime', voice: 'makkah', preferredEnd: true, obligation: true, makrooh: true },
      maghrib: { on: true, sound: 'adhan', voice: 'makkah', preferredEnd: true, obligation: true, makrooh: true },
      isha: { on: true, sound: 'chime', voice: 'makkah', preferredEnd: true, obligation: true, makrooh: true },
    },
  },
  adhkar: { morning: true, morningOffset: 30, evening: true, eveningOffset: 30 },
  fasting: { ramadanMode: 'auto', suhoorBefore: 30, iftarMode: 'adhan', iftarBefore: 10, sunnahFasts: false, tarawih: true },
  qibla: 'geographic',
  haptics: true,
};
