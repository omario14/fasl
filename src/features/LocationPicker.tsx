import { useState } from 'react';
import { useApp } from '../core/store';
import { deviceTz } from '../core/time';
import type { Place } from '../core/types';
import { nearestCity, searchCities } from '../data/cities';
import { useI18n } from '../i18n';
import { ICheck, IPin, ISearch } from '../ui/Icons';

export function locate(): Promise<Place> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('unavailable'));
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const { latitude: lat, longitude: lng, altitude } = p.coords;
        const { city, km } = nearestCity(lat, lng);
        resolve({
          mode: 'gps',
          lat,
          lng,
          name: km < 60 ? city[0] : `${lat.toFixed(3)}, ${lng.toFixed(3)}`,
          nameAr: km < 60 ? city[1] : undefined,
          country: km < 400 ? city[2] : undefined,
          tz: deviceTz(),
          elevation: altitude ?? undefined,
        });
      },
      reject,
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 },
    );
  });
}

/** GPS or offline city search. Calls onPick with the chosen place; never sends location anywhere. */
export function LocationPicker({ onPick, compact }: { onPick: (p: Place) => void; compact?: boolean }) {
  const { s } = useApp();
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const results = searchCities(q, compact ? 6 : 8);

  return (
    <div className="locpick">
      <button
        className="btn btn-primary locpick-gps"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setErr('');
          try {
            onPick(await locate());
          } catch {
            setErr(t('set.gpsFail'));
          } finally {
            setBusy(false);
          }
        }}
      >
        <IPin />
        {busy ? t('set.gpsBusy') : t('set.useGps')}
      </button>
      {err && (
        <p className="form-err" role="alert">
          {err}
        </p>
      )}
      <div className="search" style={{ marginTop: 14 }}>
        <ISearch />
        <label className="sr-only" htmlFor="city-q">
          {t('set.searchCity')}
        </label>
        <input id="city-q" className="field" placeholder={t('set.searchCity')} value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      </div>
      <ul className="city-list" role="listbox" aria-label={t('set.searchCity')}>
        {results.map((c) => {
          const selected = s.location.mode === 'city' && s.location.name === c[0];
          return (
            <li key={c[0] + c[2]}>
              <button
                role="option"
                aria-selected={selected}
                className="city"
                onClick={() => onPick({ mode: 'city', name: c[0], nameAr: c[1], country: c[2], lat: c[3], lng: c[4], tz: c[5] })}
              >
                <span>
                  <b>{s.lang === 'ar' ? c[1] : c[0]}</b>
                  <span className="muted"> · {s.lang === 'ar' ? c[0] : c[1]}</span>
                </span>
                <span className="city-meta">{selected ? <ICheck /> : c[2]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
