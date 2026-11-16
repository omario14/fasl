import { useMemo } from 'react';
import { href } from '../core/router';
import { statusOf } from '../core/status';
import { useApp } from '../core/store';
import { useI18n } from '../i18n';
import { WithPrayer } from './controls';
import { Mark } from './Mark';
import { MiniArc } from './Ring';

/**
 * The persistent bar — Fasl's defining surface. Always on top of every screen, silent, updated
 * each minute, colour alone carrying urgency through the 4px stripe.
 */
export function StatusBar() {
  const { pos, s } = useApp();
  const i = useI18n();
  const minute = Math.floor(pos.now.getTime() / 60000);
  const st = useMemo(() => statusOf(pos, i), [minute, pos.urgency, pos.prayed, i]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!s.notify.statusBar) return null;
  const target = pos.active && !pos.prayed ? pos.active.id : pos.next.id;
  return (
    <div className="statusbar">
      <a
        className="sb"
        href={href(`/prayer/${target}`)}
        style={{ ['--state' as string]: st.color }}
        aria-label={st.plain}
        data-urgency={pos.urgency}
      >
        <Mark size={40} />
        <span className="sb-stripe" aria-hidden />
        <span className="sb-text">
          <span className="sb-title" style={{ display: 'block' }}>
            <WithPrayer tpl={st.title} prayer={st.prayer} />
          </span>
          <span className="sb-body" style={{ display: 'block' }}>
            {st.body}
          </span>
        </span>
        <MiniArc progress={st.progress} color={st.color} />
      </a>
    </div>
  );
}
