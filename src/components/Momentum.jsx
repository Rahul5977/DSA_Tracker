import { dailySeries, weekDelta } from '../lib/insights.js'
import { todayStr } from '../lib/dates.js'

const WD = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function Momentum({ metrics }) {
  const series = dailySeries(metrics.byDate, 14)
  const wk = weekDelta(metrics.byDate)
  const max = Math.max(1, ...series.map((d) => d.count))
  const today = todayStr()

  return (
    <div className="panel">
      <div className="cardhead">
        <h3>Momentum</h3>
        <span className="tag">last 14 days</span>
      </div>

      <div className="momentum-bars">
        {series.map((d, i) => {
          const h = d.count ? 12 + (d.count / max) * 64 : 4
          const isToday = d.date === today
          const dow = new Date(d.date).getDay()
          return (
            <div key={i} className="mbar-col" title={`${d.date} — ${d.count} solved`}>
              <div className="mbar-track">
                <div
                  className={'mbar-fill' + (isToday ? ' today' : '')}
                  style={{ height: h }}
                />
              </div>
              <span className={'mbar-day' + (isToday ? ' today' : '')}>{WD[dow]}</span>
            </div>
          )
        })}
      </div>

      <div className="momentum-foot">
        <div>
          <b className="disp" style={{ color: 'var(--mint)' }}>{wk.thisWeek}</b>
          <span> solved this week</span>
        </div>
        <div className={'velo ' + (wk.up ? 'up' : 'down')}>
          {wk.up ? '▲' : '▼'} {Math.abs(wk.pct)}%
          <small>vs last week ({wk.prevWeek})</small>
        </div>
      </div>
    </div>
  )
}
