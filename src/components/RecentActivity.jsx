import { recentlySolved } from '../lib/insights.js'
import { fmtShort, todayStr, addDays } from '../lib/dates.js'
import { problemUrl } from '../lib/problems.js'

function relDay(date) {
  const today = todayStr()
  if (date === today) return 'today'
  if (date === addDays(today, -1)) return 'yesterday'
  return fmtShort(date)
}

export default function RecentActivity({ slots, state }) {
  const items = recentlySolved(slots, state, 6)
  return (
    <div className="panel">
      <div className="cardhead">
        <h3>Recently solved</h3>
        <span className="tag">newest first</span>
      </div>
      {items.length === 0 ? (
        <div className="empty">No problems checked off yet — solve one to start the log.</div>
      ) : (
        <div className="recent">
          {items.map((it, i) => (
            <a
              key={i}
              className="recent-row"
              href={it.slug ? problemUrl(it.source, it.slug, it.title) : undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="cb ck recent-check" />
              <span className="recent-title">{it.title}</span>
              <span className={'diff ' + it.diff}>{it.diff}</span>
              <span className="recent-date mono">{relDay(it.date)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
