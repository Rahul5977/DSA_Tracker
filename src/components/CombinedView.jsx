import { addDays, fmt } from '../lib/dates.js'
import { dayKey } from '../lib/model.js'
import { theoryDayKey } from '../lib/theoryModel.js'
import DayCard from './DayCard.jsx'
import ConceptCard from './ConceptCard.jsx'

export default function CombinedView({ dsaSlots, theorySlots, state, actions, toast }) {
  const max = Math.max(dsaSlots.length, theorySlots.length)
  const rows = []
  for (let i = 0; i < max; i++) {
    rows.push({ i, dsa: dsaSlots[i] || null, theory: theorySlots[i] || null })
  }

  return (
    <section className="view">
      <div className="eyebrow">Two Tracks, One Calendar</div>
      <h2 className="section">The combined plan.</h2>
      <p className="lede">
        Each row is one calendar day — DSA on the left, CS theory on the right. The theory column moves through OS → DBMS → CN → OOP as the days advance.
        Tap any card to open it; everything stays collapsed until you do.
      </p>

      <div className="combined-head">
        <div className="combined-col-label">⚙️ DSA</div>
        <div className="combined-col-label">📚 CS Theory</div>
      </div>

      <div className="combined">
        {rows.map(({ i, dsa, theory }) => {
          const date = addDays(state.startDate, i)
          return (
            <div className="combined-row" key={i}>
              <div className="combined-daylabel">Day {i + 1} · {fmt(date)}</div>
              <div className="combined-pair">
                <div className="combined-cell">
                  {dsa ? (
                    <DayCard
                      slot={dsa}
                      date={addDays(state.startDate, dsa.g)}
                      gIndex={dsa.g}
                      state={state}
                      isOpen={!!state.open[dayKey(dsa)]}
                      actions={actions}
                      toast={toast}
                    />
                  ) : (
                    <div className="combined-rest">🌙 Rest day — no DSA scheduled.</div>
                  )}
                </div>
                <div className="combined-cell">
                  {theory ? (
                    <ConceptCard
                      slot={theory}
                      date={addDays(state.startDate, theory.g)}
                      gIndex={theory.g}
                      state={state}
                      isOpen={!!state.theory.open[theoryDayKey(theory)]}
                      actions={actions}
                      toast={toast}
                    />
                  ) : (
                    <div className="combined-rest">🌙 No theory today.</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
