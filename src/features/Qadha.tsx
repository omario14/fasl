import { PRAYER_AR, PRAYER_COLOR, PRAYER_LATIN } from '../core/config';
import { computeDay, spanKey } from '../core/prayer';
import { useApp } from '../core/store';
import { addDays, keyOf } from '../core/time';
import { PRAYERS, type PrayerId } from '../core/types';
import { useI18n } from '../i18n';
import { Seg } from '../ui/controls';
import { ICheck, IMinus, IPlus } from '../ui/Icons';

export default function QadhaPage() {
  const { s, data, setData, today, isPrayed } = useApp();
  const i = useI18n();
  const { t, digits } = i;
  const owedTotal = PRAYERS.reduce((a, p) => a + data.qadha[p], 0);
  const perDay = data.qadhaPerDay;
  const days = Math.ceil(owedTotal / perDay);
  const finish = addDays(today, days);

  const adj = (p: PrayerId, d: number) => setData((x) => ({ qadha: { ...x.qadha, [p]: Math.max(0, x.qadha[p] + d) } }));
  const makeUp = (p: PrayerId) =>
    setData((x) => ({
      qadha: { ...x.qadha, [p]: Math.max(0, x.qadha[p] - 1) },
      qadhaDone: { ...x.qadhaDone, [p]: x.qadhaDone[p] + 1 },
    }));

  // The last seven completed days; spans the user did not mark as prayed.
  const week = Array.from({ length: 7 }, (_, k) => computeDay(s, addDays(today, k - 7)));
  const yesterday = week[6];
  const unmarked = yesterday.spans.filter((sp) => !isPrayed(sp) && !data.qadhaLogged[spanKey(sp)]);

  return (
    <div className="page qadha">
      <header className="page-head">
        <div>
          <h1 className="page-title">{t('qadha.title')}</h1>
          <p className="page-sub">{t('qadha.sub')}</p>
        </div>
      </header>

      <div className="qadha-layout">
        <section className="group" aria-label={t('qadha.owed')}>
          {PRAYERS.map((p) => (
            <div key={p} className="row qrow" style={{ ['--chapter' as string]: PRAYER_COLOR[p] }}>
              <span className="qrow-stripe" aria-hidden />
              <div className="row-main">
                <div className="row-title">
                  <span className="ar" lang="ar" style={{ fontSize: 19 }}>
                    {PRAYER_AR[p]}
                  </span>{' '}
                  <span className="muted">{PRAYER_LATIN[p]}</span>
                </div>
                <div className="row-sub num">
                  {t('qadha.owed')} {digits(data.qadha[p])} · {t('qadha.made')} {digits(data.qadhaDone[p])}
                </div>
              </div>
              <div className="stepper">
                <button className="icon-btn" onClick={() => adj(p, -1)} aria-label={`${t('qadha.remove')} · ${PRAYER_LATIN[p]}`} disabled={data.qadha[p] === 0}>
                  <IMinus />
                </button>
                <span className="stepper-n num">{digits(data.qadha[p])}</span>
                <button className="icon-btn" onClick={() => adj(p, 1)} aria-label={`${t('qadha.add')} · ${PRAYER_LATIN[p]}`}>
                  <IPlus />
                </button>
              </div>
              <button className="btn btn-ghost qrow-made" onClick={() => makeUp(p)} disabled={data.qadha[p] === 0} aria-label={`${t('qadha.makeup')} · ${PRAYER_LATIN[p]}`}>
                <ICheck />
                <span>{t('qadha.made')}</span>
              </button>
            </div>
          ))}
        </section>

        <div className="qadha-side">
          <section className="card qplan">
            <p className="caps">{t('qadha.perDay')}</p>
            <Seg<number>
              label={t('qadha.perDay')}
              value={perDay}
              onChange={(v) => setData(() => ({ qadhaPerDay: v }))}
              options={[1, 2, 3, 5, 10].map((v) => ({ v, label: digits(v) }))}
            />
            <p className="qplan-out">
              {owedTotal === 0 ? t('qadha.clear') : t('qadha.finish', { n: perDay, date: i.gregDate(finish.y, finish.m, finish.d) })}
            </p>
            {owedTotal > 0 && <p className="qplan-left num">{t('qadha.left', { n: owedTotal })}</p>}
          </section>

          <section className="card qweek" aria-labelledby="qw">
            <h2 id="qw" className="section-title">
              {t('qadha.history')}
            </h2>
            <div className="qweek-grid">
              {week.map((d) => (
                <div key={d.key} className="qweek-day">
                  <span className="caps">{i.gregDate(d.ymd.y, d.ymd.m, d.ymd.d, { weekday: 'short' })}</span>
                  {d.spans.map((sp) => (
                    <span
                      key={sp.id}
                      className={`qdot ${isPrayed(sp) ? 'on' : ''}`}
                      style={{ ['--chapter' as string]: PRAYER_COLOR[sp.id] }}
                      title={`${PRAYER_LATIN[sp.id]} · ${keyOf(d.ymd)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            {unmarked.length > 0 && (
              <button
                className="btn btn-ghost"
                onClick={() =>
                  setData((x) => {
                    const qadha = { ...x.qadha };
                    const logged = { ...x.qadhaLogged };
                    for (const sp of unmarked) {
                      qadha[sp.id] += 1;
                      logged[spanKey(sp)] = true;
                    }
                    return { qadha, qadhaLogged: logged };
                  })
                }
              >
                <IPlus />
                {t('qadha.addUnmarked', { n: unmarked.length })}
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
