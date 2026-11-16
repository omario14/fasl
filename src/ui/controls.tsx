import { useEffect, useRef, type ReactNode } from 'react';
import { ArchCrown, IBack, IClose } from './Icons';
import { PLACEHOLDER } from '../core/status';
import { PRAYER_AR } from '../core/config';
import type { PrayerId } from '../core/types';

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="toggle" onClick={() => onChange(!checked)} />;
}

export function Seg<T extends string | number>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { v: T; label: ReactNode }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.v)} type="button" aria-pressed={o.v === value} onClick={() => onChange(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Row({ title, sub, children, htmlFor }: { title: ReactNode; sub?: ReactNode; children?: ReactNode; htmlFor?: string }) {
  return (
    <div className="row">
      <div className="row-main">
        {htmlFor ? (
          <label className="row-title" htmlFor={htmlFor}>
            {title}
          </label>
        ) : (
          <div className="row-title">{title}</div>
        )}
        {sub && <div className="row-sub">{sub}</div>}
      </div>
      {children}
    </div>
  );
}

export function ToggleRow({ title, sub, checked, onChange }: { title: string; sub?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Row title={title} sub={sub}>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </Row>
  );
}

export function Sheet({ title, onClose, children, closeLabel }: { title: string; onClose: () => void; children: ReactNode; closeLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="arch-head">
          <button className="icon-btn sheet-close" onClick={onClose} aria-label={closeLabel}>
            <IClose />
          </button>
          <ArchCrown />
          <h2 className="sheet-title">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <a className="back" href={to}>
      <IBack />
      {label}
    </a>
  );
}

/** Renders a status template with the Arabic prayer name set in Amiri. */
export function WithPrayer({ tpl, prayer }: { tpl: string; prayer: PrayerId }) {
  const [a, b] = tpl.split(PLACEHOLDER);
  if (b === undefined) return <>{tpl}</>;
  return (
    <>
      {a}
      <span className="ar" lang="ar">
        {PRAYER_AR[prayer]}
      </span>
      {b}
    </>
  );
}
