import { addDays, daysBetween, fmtShort, todayStr } from '../lib/dates.js'
import { streak } from '../lib/model.js'
import ProgressRing from './ProgressRing.jsx'
import PaceChart from './PaceChart.jsx'
import Heatmap from './Heatmap.jsx'
import DifficultyDonut from './DifficultyDonut.jsx'
import SourceBars from './SourceBars.jsx'
import PhaseBars from './PhaseBars.jsx'
import StatStrip from './StatStrip.jsx'
import NextUp from './NextUp.jsx'
import FocusAndDifficulty from './FocusAndDifficulty.jsx'
import Momentum from './Momentum.jsx'
import RecentActivity from './RecentActivity.jsx'

function paceInfo(m) {
  const targetFrac = (m.todayIdx + 1) / m.totalDays
  const target = Math.round(m.total * targetFrac)
  const diff = m.solved - target
  if (m.solved === 0)
    return { state: 'Not started', color: 'var(--txt-dim)', msg: 'Check off your first problem to start tracking pace.', dot: 'var(--txt-faint)' }
  if (diff >= 0)
    return {
      state: 'On track', color: 'var(--mint)', dot: 'var(--mint)',
      msg: diff === 0 ? 'Right on the target line — keep the rhythm.' : `You're ${diff} problem(s) ahead of the target pace. 🔥`,
    }
  return { state: 'Behind', color: 'var(--rose)', dot: 'var(--rose)', msg: `You're ${-diff} behind target. A catch-up day or a heavier session will close it.` }
}

function projection(m, startDate) {
  const today = todayStr()
  if (m.solved >= m.total && m.total > 0) return { finish: 'Done 🏔', msg: 'you completed every problem' }
  const elapsed = Math.max(1, daysBetween(startDate, today) + 1)
  const rate = m.solved / elapsed
  if (rate <= 0) return { finish: '—', msg: 'at your current rate' }
  const daysLeft = Math.ceil((m.total - m.solved) / rate)
  const finish = addDays(today, daysLeft)
  const planned = addDays(startDate, m.totalDays - 1)
  const d2 = daysBetween(planned, finish)
  return {
    finish: fmtShort(finish),
    msg: d2 <= 0 ? `on or ahead of your ${fmtShort(planned)} target` : `${d2} day(s) past the ${fmtShort(planned)} target at this rate`,
  }
}

export default function Dashboard({ metrics, startDate, slots, state, onGoToPlan }) {
  const pct = metrics.total ? metrics.solved / metrics.total : 0
  const pace = paceInfo(metrics)
  const proj = projection(metrics, startDate)

  return (
    <section className="view">
      <div className="eyebrow">Mission Control</div>
      <h2 className="section">Where you stand, Rahul.</h2>
      <p className="lede">Every problem you check off updates the ring, the pace line, and the streak grid below. Stay above the target pace and you reach the summit on schedule.</p>

      <div className="hero">
        <div className="panel">
          <div className="ringwrap">
            <ProgressRing pct={pct} />
            <div className="herostats">
              <div className="bigstat"><b style={{ color: 'var(--mint)' }}>{metrics.solved}</b><span>problems solved of <b className="mono" style={{ fontSize: 13, color: 'var(--txt-dim)' }}>{metrics.total}</b></span></div>
              <div className="statgrid">
                <div className="bigstat mini"><b style={{ color: 'var(--amber)' }}>{metrics.solvedToday}</b><span>solved today</span></div>
                <div className="bigstat mini"><b style={{ color: 'var(--peri)' }}>{streak(metrics.byDate)}</b><span>day streak 🔥</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel sidecard">
          <div className="pace">
            <div className="row"><span style={{ color: 'var(--txt-dim)' }}>Pace vs. target</span><b style={{ color: pace.color }}>{pace.state}</b></div>
            <div className="pacebar"><i style={{ width: `${Math.min(100, Math.round(pct * 100))}%` }} /></div>
            <div className="pacenote"><span className="dot" style={{ background: pace.dot }} /><span>{pace.msg}</span></div>
          </div>
          <div className="pace">
            <div className="row"><span style={{ color: 'var(--txt-dim)' }}>Projected finish</span><b className="mono" style={{ color: 'var(--amber-soft)' }}>{proj.finish}</b></div>
            <div className="pacenote"><span className="dot" style={{ background: 'var(--peri)' }} /><span>{proj.msg}</span></div>
          </div>
          <div className="pace">
            <div className="row"><span style={{ color: 'var(--txt-dim)' }}>Core campaign</span><b className="mono">{metrics.coreSolved} / {metrics.coreTotal}</b></div>
            <div className="row" style={{ marginTop: 6 }}><span style={{ color: 'var(--txt-dim)' }}>DP extension</span><b className="mono" style={{ color: 'var(--peri-soft)' }}>{metrics.extSolved} / {metrics.extTotal}</b></div>
          </div>
        </div>
      </div>

      <StatStrip metrics={metrics} startDate={startDate} />

      <div className="grid2">
        <Momentum metrics={metrics} />
        <RecentActivity slots={slots} state={state} />
      </div>

      <div className="grid2">
        <NextUp slots={slots} state={state} onGoToPlan={onGoToPlan} />
        <FocusAndDifficulty metrics={metrics} onGoToPlan={onGoToPlan} />
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="cardhead"><h3>Progress by phase</h3><span className="tag">core + extension</span></div>
          <PhaseBars metrics={metrics} />
        </div>
        <div className="panel">
          <div className="cardhead"><h3>Pace curve</h3><span className="tag">solved vs target</span></div>
          <PaceChart metrics={metrics} startDate={startDate} />
          <div className="legend">
            <span><span className="dot" style={{ background: 'var(--mint)' }} />Your cumulative</span>
            <span><span className="dot" style={{ background: 'var(--peri)' }} />Target pace</span>
            <span><span className="dot" style={{ background: 'var(--amber)' }} />Today</span>
          </div>
        </div>
      </div>

      <div className="grid3">
        <div className="panel">
          <div className="cardhead"><h3>Activity</h3><span className="tag">{metrics.totalDays} days</span></div>
          <Heatmap metrics={metrics} startDate={startDate} />
          <div className="legend">
            <span>Less</span>
            <span className="cell" style={{ width: 13, height: 13, borderRadius: 3, background: 'var(--ink-3)' }} />
            <span className="cell" style={{ width: 13, height: 13, borderRadius: 3, background: 'rgba(66,226,160,.5)' }} />
            <span className="cell" style={{ width: 13, height: 13, borderRadius: 3, background: 'var(--mint)' }} />
            <span>More</span>
            <span style={{ marginLeft: 6 }}><span className="cell" style={{ width: 13, height: 13, borderRadius: 3, boxShadow: 'inset 0 0 0 1.5px var(--peri)' }} /> contest</span>
          </div>
        </div>
        <div className="panel">
          <div className="cardhead"><h3>By difficulty</h3></div>
          <DifficultyDonut metrics={metrics} />
        </div>
        <div className="panel">
          <div className="cardhead"><h3>By source</h3></div>
          <SourceBars metrics={metrics} />
        </div>
      </div>
    </section>
  )
}
