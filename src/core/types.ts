export type PrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export const PRAYERS: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export type Lang = 'ar' | 'fr' | 'en' | 'tr';
export const RTL_LANGS: Lang[] = ['ar'];

export type MethodId =
  | 'mwl'
  | 'isna'
  | 'egypt'
  | 'ummalqura'
  | 'karachi'
  | 'tehran'
  | 'jafari'
  | 'turkey'
  | 'tunisia'
  | 'algeria'
  | 'morocco'
  | 'france'
  | 'dubai'
  | 'kuwait'
  | 'qatar'
  | 'singapore'
  | 'moonsighting'
  | 'custom';

export type Madhab = 'maliki' | 'shafii' | 'hanbali' | 'hanafi' | 'jafari';
export type AsrMethod = 'standard' | 'hanafi';
export type HighLatRule = 'angle' | 'seventh' | 'middle' | 'nearest';
export type SoundMode = 'off' | 'chime' | 'adhan' | 'iqama';
export type VoiceId = 'makkah' | 'madinah' | 'alafasy' | 'abdulbasit' | 'minshawi' | 'tunisian';
export type Theme = 'dark' | 'light' | 'auto';

export interface Place {
  mode: 'gps' | 'city' | 'manual';
  lat: number;
  lng: number;
  name: string;
  nameAr?: string;
  country?: string;
  tz: string;
  elevation?: number;
}

export interface PrayerNotify {
  on: boolean;
  sound: SoundMode;
  voice: VoiceId;
  preferredEnd: boolean;
  obligation: boolean;
  makrooh: boolean;
}

export interface Settings {
  onboarded: boolean;
  lang: Lang;
  numerals: 'arab' | 'latn' | 'auto';
  clock: '24' | '12';
  datePrimary: 'hijri' | 'greg';
  theme: Theme;
  method: MethodId;
  customFajr: number;
  customIsha: number;
  madhab: Madhab;
  asr: AsrMethod;
  highLat: HighLatRule;
  offsets: Record<PrayerId, number>;
  hijriOffset: number;
  location: Place;
  tzMode: 'auto' | 'manual';
  notify: {
    master: boolean;
    statusBar: boolean;
    systemPin: boolean;
    vibration: boolean;
    volume: number;
    ramp: boolean;
    duaAfterAdhan: boolean;
    fajrVariant: boolean;
    perPrayer: Record<PrayerId, PrayerNotify>;
  };
  adhkar: { morning: boolean; morningOffset: number; evening: boolean; eveningOffset: number };
  fasting: {
    ramadanMode: 'auto' | 'on' | 'off';
    suhoorBefore: number;
    iftarMode: 'adhan' | 'before';
    iftarBefore: number;
    sunnahFasts: boolean;
    tarawih: boolean;
  };
  qibla: 'geographic' | 'magnetic';
  haptics: boolean;
}

export type WindowKind =
  | 'preferred'
  | 'permissible'
  | 'recommended'
  | 'necessity'
  | 'obligation'
  | 'makrooh'
  | 'forbidden';

export interface TimeWindow {
  kind: WindowKind;
  start: Date;
  end: Date;
}

export interface PrayerSpan {
  id: PrayerId;
  dayKey: string;
  adhan: Date;
  end: Date;
  windows: TimeWindow[];
}

export type Urgency =
  | 'calm'
  | 'approaching'
  | 'preferred'
  | 'permissible'
  | 'obligation'
  | 'urgent'
  | 'makrooh';
