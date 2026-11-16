import { useEffect, useState, type CSSProperties } from 'react';

interface Toast {
  id: number;
  title: string;
  body?: string;
  color?: string;
}

type Listener = (t: Toast[]) => void;
let items: Toast[] = [];
const listeners = new Set<Listener>();
let seq = 0;

export function toast(title: string, body?: string, color?: string, ms = 6000) {
  const t = { id: ++seq, title, body, color };
  items = [...items.slice(-2), t];
  listeners.forEach((l) => l(items));
  setTimeout(() => {
    items = items.filter((x) => x.id !== t.id);
    listeners.forEach((l) => l(items));
  }, ms);
}

export function Toasts() {
  const [list, setList] = useState<Toast[]>(items);
  useEffect(() => {
    listeners.add(setList);
    return () => {
      listeners.delete(setList);
    };
  }, []);
  return (
    <div className="toasts" role="status" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className="toast" style={t.color ? ({ ['--state' as string]: t.color } as CSSProperties) : undefined}>
          <div>
            <b>{t.title}</b>
            {t.body && <span>{t.body}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
