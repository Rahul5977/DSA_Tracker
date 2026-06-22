import { useState } from 'react'
import { fmt, isSunday, todayStr } from '../lib/dates.js'
import { theoryDayKey } from '../lib/theoryModel.js'

function Concept({ concept, isDone, onToggle }) {
  const [open, setOpen] = useState(false)
  const [openQ, setOpenQ] = useState(-1)
  const paras = (concept.explanation || '').split('\n\n').filter((p) => p.trim())
  const keyPoints = concept.keyPoints || []
  const links = concept.links || []
  const interview = concept.interview || []

  return (
    <div className={'concept' + (isDone ? ' solved' : '') + (open ? ' open' : '')}>
      <div className="concept-head">
        <span
          className={'cb' + (isDone ? ' ck' : '')}
          role="checkbox"
          aria-checked={isDone}
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
        />
        <div className="concept-info" onClick={() => setOpen((v) => !v)}>
          <div className="concept-topic">{concept.topic}</div>
          {concept.summary && <div className="concept-summary">{concept.summary}</div>}
        </div>
        <span className="chev" onClick={() => setOpen((v) => !v)}>⌄</span>
      </div>

      {open && (
        <div className="concept-body">
          {paras.map((p, i) => (
            <p key={i} className="concept-para">{p}</p>
          ))}

          {keyPoints.length > 0 && (
            <ul className="concept-keys">
              {keyPoints.map((kp, i) => (
                <li key={i}>{kp}</li>
              ))}
            </ul>
          )}

          {links.length > 0 && (
            <div className="concept-links">
              {links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer" className="concept-link">↗ {l.label}</a>
              ))}
            </div>
          )}

          {interview.length > 0 && (
            <div className="qa">
              <div className="qa-title">Interview Q&amp;A</div>
              {interview.map((qa, i) => (
                <div key={i} className={'qa-item' + (openQ === i ? ' open' : '')}>
                  <button className="qa-q" onClick={() => setOpenQ((v) => (v === i ? -1 : i))}>
                    <span className="chev">⌄</span>
                    <span>{qa.q}</span>
                  </button>
                  {openQ === i && <div className="qa-a">{qa.a}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ConceptCard({ slot, date, gIndex, state, isOpen, actions, toast }) {
  const key = theoryDayKey(slot)
  const [showNote, setShowNote] = useState(!!(state.theory.notes && state.theory.notes[key]))

  const concepts = slot.concepts || []
  const isStub = concepts.length === 0
  const solved = concepts.reduce((n, c) => {
    const r = state.theory.done[c.id]
    return n + (r && r.done ? 1 : 0)
  }, 0)
  const doneDay = concepts.length > 0 && solved === concepts.length
  const sunday = isSunday(date)
  const isToday = date === todayStr()
  const note = (state.theory.notes && state.theory.notes[key]) || ''

  return (
    <div className={'day concept-day' + (doneDay ? ' done-day' : '') + (isStub ? ' stub' : '') + (isOpen ? ' open' : '')}>
      <div className="day-head" onClick={() => actions.toggleTheoryDayOpen(slot)}>
        <div className="daynum">{gIndex + 1}</div>
        <div className="info">
          <div className="focus">
            <span className="subj-badge">{slot.subjectName}</span>
            {slot.focus}
          </div>
          <div className="date">
            {fmt(date)}
            {sunday && <span className="contest-pill">contest</span>}
            {isToday && <span className="contest-pill pill-today">today</span>}
            {isStub && <span className="soon-pill">coming soon</span>}
          </div>
        </div>
        <div className="daymini">
          {!isStub && <span className="minibar"><i style={{ width: `${concepts.length ? (solved / concepts.length) * 100 : 0}%` }} /></span>}
          {!isStub && <span className="daycount">{solved}/{concepts.length}</span>}
          <span className="chev">⌄</span>
        </div>
      </div>

      {isStub && (
        <div className="day-body">
          <div className="soon-line">📚 Content coming soon — focus planned: <b>{slot.focus}</b></div>
        </div>
      )}

      {!isStub && isOpen && (
        <div className="day-body">
          {concepts.map((c) => (
            <Concept
              key={c.id}
              concept={c}
              isDone={!!(state.theory.done[c.id] && state.theory.done[c.id].done)}
              onToggle={() => actions.toggleConcept(c.id)}
            />
          ))}

          <div className="day-tools">
            <button className="tbtn" onClick={() => setShowNote((v) => !v)}>✎ Note</button>
          </div>

          {showNote && (
            <textarea
              className="notefield"
              placeholder="Key takeaways / what to revisit…"
              value={note}
              onChange={(e) => actions.setTheoryNote(slot, e.target.value)}
              autoFocus
            />
          )}
        </div>
      )}
    </div>
  )
}
