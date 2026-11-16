import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

export { L };

/** Mounts a Leaflet map with OpenStreetMap tiles into a div; returns the map via callback. */
export function useLeaflet(setup: (map: L.Map) => void | (() => void), deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, { zoomControl: true, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    const cleanup = setup(map);
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      cleanup?.();
      map.remove();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

/** Great-circle points between two coordinates, for a true Qibla line on a Mercator map. */
export function greatCircle(a: { lat: number; lng: number }, b: { lat: number; lng: number }, n = 96): [number, number][] {
  const r = Math.PI / 180;
  const φ1 = a.lat * r, λ1 = a.lng * r, φ2 = b.lat * r, λ2 = b.lng * r;
  const d = 2 * Math.asin(Math.sqrt(Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2));
  if (d === 0) return [[a.lat, a.lng]];
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    pts.push([Math.atan2(z, Math.sqrt(x * x + y * y)) / r, Math.atan2(y, x) / r]);
  }
  return pts;
}

export const dotIcon = (color: string, size = 16) =>
  L.divIcon({
    className: 'map-dot',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid #0E1A14;box-shadow:0 0 0 2px ${color}55"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

export const kaabaIcon = () =>
  L.divIcon({
    className: 'map-kaaba',
    html: '<span style="display:block;width:20px;height:20px;background:#111;border:2px solid #C9A84C;border-radius:3px;box-shadow:inset 0 5px 0 -2px #C9A84C"></span>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
