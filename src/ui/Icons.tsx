import type { ReactElement, SVGProps } from 'react';

/** Geometric line icons on a 24 grid — zellige-inspired, 1.6 stroke. */
type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...p,
});

export const IToday = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5a8.5 8.5 0 1 1-8.1 5.9" />
    <path d="M12 7.5V12l3 2" />
    <circle cx="5.2" cy="5.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

/** Compass rose with an eight-point star. */
export const ICompass = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 5.5l1.7 4.8 4.8 1.7-4.8 1.7L12 18.5l-1.7-4.8L5.5 12l4.8-1.7z" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** Geometric flower: eight petals around a centre (duaa). */
export const IFlower = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4c1.6 1.8 1.6 4.2 0 6-1.6-1.8-1.6-4.2 0-6zM12 14c1.6 1.8 1.6 4.2 0 6-1.6-1.8-1.6-4.2 0-6zM4 12c1.8-1.6 4.2-1.6 6 0-1.8 1.6-4.2 1.6-6 0zM14 12c1.8-1.6 4.2-1.6 6 0-1.8 1.6-4.2 1.6-6 0z" />
    <path d="M6.3 6.3c2.4.1 4.1 1.8 4.2 4.2-2.4-.1-4.1-1.8-4.2-4.2zM13.5 13.5c2.4.1 4.1 1.8 4.2 4.2-2.4-.1-4.1-1.8-4.2-4.2zM17.7 6.3c-.1 2.4-1.8 4.1-4.2 4.2.1-2.4 1.8-4.1 4.2-4.2zM10.5 13.5c-.1 2.4-1.8 4.1-4.2 4.2.1-2.4 1.8-4.1 4.2-4.2z" opacity=".55" />
  </svg>
);

/** Prayer beads on a loop with a tassel. */
export const IBeads = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="4.6" r="1.6" />
    <circle cx="17.4" cy="7" r="1.6" />
    <circle cx="19" cy="12.4" r="1.6" />
    <circle cx="6.6" cy="7" r="1.6" />
    <circle cx="5" cy="12.4" r="1.6" />
    <circle cx="16.6" cy="17.2" r="1.6" />
    <circle cx="7.4" cy="17.2" r="1.6" />
    <path d="M12 19v2.5M10.6 22h2.8" />
  </svg>
);

/** Pointed zawiya arch window (calendar). */
export const IArch = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 21V11c0-4 3.2-7.2 7-8 3.8.8 7 4 7 8v10z" />
    <path d="M5 21h14M9 21v-6.5c0-1.8 1.3-3 3-3.5 1.7.5 3 1.7 3 3.5V21" />
  </svg>
);

export const IMore = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 4l2.5 2.5L6.5 9 4 6.5zM17.5 4L20 6.5 17.5 9 15 6.5zM6.5 15L9 17.5 6.5 20 4 17.5zM17.5 15l2.5 2.5-2.5 2.5-2.5-2.5z" />
  </svg>
);

export const IMosque = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 21V12M20 21V12M4 12V8.5l-.8-1.2L4 5l.8 2.3L4 8.5M20 12V8.5l-.8-1.2L20 5l.8 2.3L20 8.5" />
    <path d="M7 21v-6.5C7 11.5 9.4 9.6 12 8.5c2.6 1.1 5 3 5 6V21" />
    <path d="M12 8.5V6M12 4.2v.1M2.5 21h19M10.5 21v-3c0-.9.7-1.6 1.5-2 .8.4 1.5 1.1 1.5 2v3" />
  </svg>
);

export const IStar8 = (p: P) => (
  <svg {...base(p)}>
    <rect x="5.5" y="5.5" width="13" height="13" rx="0.5" />
    <rect x="5.5" y="5.5" width="13" height="13" rx="0.5" transform="rotate(45 12 12)" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

export const IQadha = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="3.5" width="16" height="17" rx="3" />
    <path d="M8 9l1.5 1.5L12 8M8 15l1.5 1.5L12 14M14.5 9.5H16M14.5 15.5H16" />
  </svg>
);

export const ISettings = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 2.8l1.9 2.2 2.9-.4.6 2.8 2.6 1.4-1.2 2.7 1.2 2.7-2.6 1.4-.6 2.8-2.9-.4L12 21.2l-1.9-2.2-2.9.4-.6-2.8-2.6-1.4L5.2 12 4 9.3l2.6-1.4.6-2.8 2.9.4z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);
export const IBack = (p: P) => (
  <svg {...base(p)}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
export const ISearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </svg>
);
export const IHeart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)}>
    <path d="M12 20s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z" fill={filled ? 'currentColor' : 'none'} />
  </svg>
);
export const ICheck = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const IPlus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IMinus = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);
export const IReset = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4 4.5v3.8h3.8" />
  </svg>
);
export const IPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
export const IMap = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2z" />
    <path d="M9 4.5v13M15 6.5v13" />
  </svg>
);
export const IBell = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </svg>
);
export const IPlay = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 5.5v13l10.5-6.5z" />
  </svg>
);
export const IClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const ISun = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
  </svg>
);
export const IMoon = (p: P) => (
  <svg {...base(p)}>
    <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" />
  </svg>
);
export const IDownload = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" />
  </svg>
);

/** Small arch used to crown modal headers and the chapter card. */
export const ArchCrown = (p: P) => (
  <svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden className="arch" {...p}>
    <path d="M6 39V24C6 12 18 4 32 1c14 3 26 11 26 23v15" />
    <path d="M16 39V26c0-7 7-12.5 16-15 9 2.5 16 8 16 15v13" opacity=".55" />
    <circle cx="32" cy="1.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

/** Category glyphs for the duaa library. */
export const CAT_ICON: Record<string, (p: P) => ReactElement> = {
  prayer: IArch,
  morning: (p) => (
    <svg {...base(p)}>
      <path d="M3 17.5h18M6.5 17.5a5.5 5.5 0 0 1 11 0" />
      <path d="M12 6v2.5M5 9.5l1.6 1.6M19 9.5l-1.6 1.6M8 21h8" />
    </svg>
  ),
  evening: IMoon,
  eating: (p) => (
    <svg {...base(p)}>
      <path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0z" />
      <path d="M8 20h8M9 8c0-1.5 1.5-1.5 1.5-3M13.5 8c0-1.5 1.5-1.5 1.5-3" />
    </svg>
  ),
  home: (p) => (
    <svg {...base(p)}>
      <path d="M4 20.5V10l8-6.5 8 6.5v10.5z" />
      <path d="M9.5 20.5v-5c0-1.4 1.1-2.5 2.5-3 1.4.5 2.5 1.6 2.5 3v5" />
    </svg>
  ),
  travel: (p) => (
    <svg {...base(p)}>
      <path d="M4 19.5c3-1 4-4 8-4s5-3 8-3" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M4 15c2-.6 3-2 5-2" opacity=".55" />
    </svg>
  ),
  rain: (p) => (
    <svg {...base(p)}>
      <path d="M7 14.5a4.5 4.5 0 0 1 .6-9 5.5 5.5 0 0 1 10.6 1.6A3.7 3.7 0 0 1 17.5 14.5z" />
      <path d="M8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5" />
    </svg>
  ),
  distress: (p) => <IHeart {...p} />,
  sleep: (p) => (
    <svg {...base(p)}>
      <path d="M17 15.5A7 7 0 0 1 8.5 6.9a7 7 0 1 0 8.5 8.6z" />
      <path d="M15 4l.7 1.6 1.6.7-1.6.7L15 8.6l-.7-1.6-1.6-.7 1.6-.7z" />
    </svg>
  ),
  occasions: IStar8,
};

export const IGlobe = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" />
  </svg>
);

/** Five arcs with gaps — the day ring. */
export const IRing = (p: P) => (
  <svg {...base(p)}>
    <path d="M12.7 3.1a9 9 0 0 1 7.6 5.5M20.7 10.5a9 9 0 0 1-2.2 8.4M16.8 20.1a9 9 0 0 1-9.6 0M5.5 18.9a9 9 0 0 1-2.2-8.4M3.7 8.6a9 9 0 0 1 7.6-5.5" />
  </svg>
);
