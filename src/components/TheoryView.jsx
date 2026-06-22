import { useState } from 'react'
import { addDays, fmtShort } from '../lib/dates.js'
import { theoryDayKey } from '../lib/theoryModel.js'
import ConceptCard from './ConceptCard.jsx'

const FILTERS = [
  ['all', 'All'],
  ['todo', 'Unsolved only'],
]

export default function TheoryView({ subjectKey, slots, state, theoryMetrics, actions, toast }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const subjectSlots = slots.filter((s) => s.subjectKey === subjectKey)
  const subjMeta = theoryMetrics && theoryMetrics.bySubject ? theoryMetrics.bySubject[subjectKey] : null
  const subjectName = subjMeta ? subjMeta.name : (subjectSlots[0] ? subjectSlots[0].subjectName : subjectKey)
  const subjectTag = subjectSlots[0] ? subjectSlots[0].subjectTag : ''
  const solved = subjMeta ? subjMeta.solved : 0
  const total = subjMeta ? subjMeta.total : 0
  const pct = total ? Math.round((solved / total) * 100) : 0

  const isStub = subjectSlots.length > 0 && subjectSlots.every((s) => !s.concepts || s.concepts.length === 0)

  const conceptDone = (c) => {
    const r = state.theory.done[c.id]
    return !!(r && r.done)
  }

  const visibleSlots = subjectSlots.filter((s) => {
    const concepts = s.concepts || []
    if (filter === 'todo') {
      const allDone = concepts.length > 0 && concepts.every(conceptDone)
      if (allDone) return false
    }
    if (q) {
      const hit = s.focus.toLowerCase().includes(q) || concepts.some((c) => (c.topic || '').toLowerCase().includes(q))
      if (!hit) return false
    }
    return true
  })

  return (
    <section className="view">
      <div className="eyebrow">{subjectTag}</div>
      <h2 className="section">{subjectName}</h2>
      <p className="lede">
        {subjectSlots.length} day{subjectSlots.length === 1 ? '' : 's'} of {subjectName} theory.
        Tap a day to open it; check off concepts as you internalise them. Each concept opens to notes, key points, references and interview Q&amp;A.
      </p>

      <div className="planctrl">
        <div className="seg">
          {FILTERS.map(([f, label]) => (
            <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{label}</button>
          ))}
        </div>
        <div className="seg">
          <button onClick={() => actions.setAllTheoryOpen(false)}>Collapse all</button>
          <button onClick={() => actions.setAllTheoryOpen(true)}>Expand all</button>
        </div>
        <div className="searchfield">
          <input type="search" placeholder="Search concepts…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="phase-prog" style={{ marginLeft: 'auto' }}>{solved} / {total}<br />{pct}%</div>
      </div>

      {isStub && (
        <div className="note-banner">📚 Full notes coming soon — here's the planned roadmap.</div>
      )}

      {isStub ? (
        <div className="roadmap">
          {subjectSlots.map((s) => (
            <div className="roadmap-row" key={theoryDayKey(s)}>
              <span className="roadmap-day">Day {s.g + 1}</span>
              <span className="roadmap-focus">{s.focus}</span>
              <span className="roadmap-date mono">{fmtShort(addDays(state.startDate, s.g))}</span>
            </div>
          ))}
        </div>
      ) : (
        visibleSlots.length ? visibleSlots.map((s) => (
          <ConceptCard
            key={theoryDayKey(s)}
            slot={s}
            date={addDays(state.startDate, s.g)}
            gIndex={s.g}
            state={state}
            isOpen={!!state.theory.open[theoryDayKey(s)] || !!q}
            actions={actions}
            toast={toast}
          />
        )) : (
          <div className="note-banner">Nothing matches this filter — every concept here is already done, or your search came up empty. 🎉</div>
        )
      )}
    </section>
  )
}
