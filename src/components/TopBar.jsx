import { fmt, todayStr } from '../lib/dates.js'

const TABS = [
  ['dash', 'Dashboard'],
  ['plan', 'The Plan'],
  ['contests', 'Contests'],
]

export default function TopBar({ view, setView, metrics }) {
  return (
    <>
      <div className="topbar">
        <div className="brand">
          <div className="glyph">A</div>
          <div>
            <h1>Ascent</h1>
            <span>DSA Placement Campaign</span>
          </div>
        </div>
        <nav className="tabs">
          {TABS.map(([v, label]) => (
            <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{label}</button>
          ))}
        </nav>
        <div className="spacer" />
        <div className="daychip">
          <b>Day {metrics.dayNumber} / {metrics.totalDays}</b>
          <small>{fmt(todayStr())}</small>
        </div>
      </div>
      <div className="mobnav">
        {TABS.map(([v, label]) => (
          <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{label}</button>
        ))}
      </div>
    </>
  )
}
