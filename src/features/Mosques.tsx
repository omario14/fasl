import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../core/store';
import { haversineKm } from '../data/cities';
import { useI18n } from '../i18n';
import { Toggle } from '../ui/controls';
import { IMosque, IPin, ISearch } from '../ui/Icons';
import { dotIcon, L, useLeaflet } from './map';

interface Mosque {
  id: string;
  name: string;
  lat: number;
  lng: number;
  street?: string;
  jumuah: boolean;
  times?: string;
}

interface Cache {
  at: number;
  lat: number;
  lng: number;
  items: Mosque[];
}

const CACHE_KEY = 'fasl.mosques.v1';
const RADIUS_KM = 5;
// Names that mark a congregational (Friday) mosque across the app's languages.
const JAMI = /(جامع|jami|cami|camii|grande mosqu|great mosque|central mosque|masjid jami)/i;

function readCache(): Cache | null {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  } catch {
    return null;
  }
}

async function overpass(lat: number, lng: number): Promise<Mosque[]> {
  const r = RADIUS_KM * 1000;
  const q = `[out:json][timeout:20];(nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${r},${lat},${lng}););out center tags 80;`;
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(q),
  });
  if (!res.ok) throw new Error(String(res.status));
  const json = (await res.json()) as { elements: { type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[] };
  return json.elements
    .map((e) => {
      const tags = e.tags ?? {};
      const la = e.lat ?? e.center?.lat;
      const lo = e.lon ?? e.center?.lon;
      if (la == null || lo == null) return null;
      const name = tags['name'] || tags['name:ar'] || tags['name:fr'] || tags['name:en'] || '';
      return {
        id: `${e.type}/${e.id}`,
        name,
        lat: la,
        lng: lo,
        street: tags['addr:street'] || tags['addr:suburb'] || tags['addr:city'],
        jumuah: JAMI.test(`${name} ${tags['name:ar'] ?? ''} ${tags['name:en'] ?? ''}`) || tags['mosque'] === 'jami',
        times: tags['service_times'] || tags['opening_hours'],
      } as Mosque;
    })
    .filter((m): m is Mosque => !!m);
}

export default function MosquesPage() {
  const { s } = useApp();
  const i = useI18n();
  const { t } = i;
  const [cache, setCache] = useState<Cache | null>(readCache);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [jumuah, setJumuah] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const here = { lat: s.location.lat, lng: s.location.lng };

  const search = async () => {
    setState('loading');
    try {
      const items = await overpass(here.lat, here.lng);
      const sorted = items
        .map((m) => ({ m, d: haversineKm(here, m) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 50)
        .map((x) => x.m);
      const c = { at: Date.now(), lat: here.lat, lng: here.lng, items: sorted };
      setCache(c);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(c));
      } catch {
        /* storage full */
      }
      setState('idle');
    } catch {
      setState('error');
    }
  };

  const list = useMemo(() => {
    const items = cache?.items ?? [];
    return items
      .filter((m) => !jumuah || m.jumuah)
      .map((m) => {
        const km = haversineKm(here, m);
        return { ...m, km, walk: Math.max(1, Math.round((km * 1000) / 80)) };
      })
      .sort((a, b) => a.km - b.km);
  }, [cache, jumuah, here.lat, here.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  const stale = cache && haversineKm(here, cache) > 1;

  return (
    <div className="page mosques">
      <header className="page-head">
        <div>
          <h1 className="page-title">{t('mos.title')}</h1>
          <p className="page-sub">
            <IPin width={14} height={14} style={{ verticalAlign: '-2px' }} /> {s.lang === 'ar' && s.location.nameAr ? s.location.nameAr : s.location.name} ·{' '}
            {t('mos.radius', { km: RADIUS_KM })}
          </p>
        </div>
        <button className="btn btn-primary" onClick={search} disabled={state === 'loading'}>
          <ISearch />
          {state === 'loading' ? t('mos.loading') : t('mos.find')}
        </button>
      </header>

      <div className="mos-layout">
        <section className="card mos-map-card">
          <MosqueMap here={here} items={list} focus={focus} />
        </section>
        <section className="mos-list-wrap">
          <div className="row card mos-filter">
            <div className="row-main">
              <div className="row-title">{t('mos.jumuah')}</div>
              {cache && !stale && <div className="row-sub">{t('mos.cached', { t: i.gregDate(new Date(cache.at).getFullYear(), new Date(cache.at).getMonth() + 1, new Date(cache.at).getDate(), { day: 'numeric', month: 'short' }) })}</div>}
            </div>
            <Toggle checked={jumuah} onChange={setJumuah} label={t('mos.jumuah')} />
          </div>
          {state === 'error' && (
            <p className="note" role="alert">
              {t('mos.error')}
            </p>
          )}
          {!cache && state !== 'loading' && <p className="note">{t('mos.intro')}</p>}
          {cache && list.length === 0 && state === 'idle' && <p className="note">{t('mos.none', { km: RADIUS_KM })}</p>}
          <ul className="mos-list">
            {list.map((m) => (
              <li key={m.id}>
                <div className={`mos card ${focus === m.id ? 'focus' : ''}`}>
                  <button className="mos-main" onClick={() => setFocus(m.id)}>
                    <span className="mos-icon">
                      <IMosque />
                    </span>
                    <span className="mos-text">
                      <b>{m.name || t('mos.unnamed')}</b>
                      <span className="muted">
                        {m.street ? `${m.street} · ` : ''}
                        {t('mos.walk', { m: m.walk })} · {i.num(m.km, { maximumFractionDigits: 1 })} km
                      </span>
                      {m.times && <span className="muted mos-times">{m.times}</span>}
                    </span>
                    {m.jumuah && <span className="pill">الجمعة</span>}
                  </button>
                  <a className="btn btn-quiet" href={`https://www.openstreetmap.org/directions?to=${m.lat}%2C${m.lng}`} target="_blank" rel="noreferrer">
                    {t('mos.directions')}
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <p className="caps mos-osm">{t('mos.osm')}</p>
        </section>
      </div>
    </div>
  );
}

function MosqueMap({ here, items, focus }: { here: { lat: number; lng: number }; items: (Mosque & { km: number })[]; focus: string | null }) {
  const layer = useRef<L.LayerGroup | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const ref = useLeaflet(
    (map) => {
      mapRef.current = map;
      map.setView([here.lat, here.lng], 14);
      L.marker([here.lat, here.lng], { icon: dotIcon('#4FC8A0') }).addTo(map);
      layer.current = L.layerGroup().addTo(map);
      return () => {
        mapRef.current = null;
      };
    },
    [here.lat, here.lng],
  );
  useEffect(() => {
    const g = layer.current;
    const map = mapRef.current;
    if (!g || !map) return;
    g.clearLayers();
    for (const m of items) {
      L.marker([m.lat, m.lng], { icon: dotIcon(m.jumuah ? '#C9A84C' : '#D4823A', 14), title: m.name }).addTo(g);
    }
    if (items.length) {
      map.fitBounds(L.latLngBounds([[here.lat, here.lng], ...items.slice(0, 12).map((m) => [m.lat, m.lng] as [number, number])]), { padding: [30, 30], maxZoom: 16 });
    }
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const m = items.find((x) => x.id === focus);
    if (m && mapRef.current) mapRef.current.setView([m.lat, m.lng], 17, { animate: !matchMedia('(prefers-reduced-motion: reduce)').matches });
  }, [focus]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div ref={ref} className="map mos-map" />;
}
