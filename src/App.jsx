import { useCallback, useEffect, useRef, useState } from 'react'
import { useTracker } from './hooks/useTracker.js'
import { HAS_LS } from './lib/storage.js'
import TopBar from './components/TopBar.jsx'
import Dashboard from './components/Dashboard.jsx'
import PlanView from './components/PlanView.jsx'
import CombinedView from './components/CombinedView.jsx'
import TheoryView from './components/TheoryView.jsx'
import Contests from './components/Contests.jsx'
import Onboarding from './components/Onboarding.jsx'

const THEORY_KEYS = ['os', 'dbms', 'cn', 'oop']

export default function App() {
  const tracker = useTracker()
  const { state, slots, metrics, theorySlots, theoryMetrics } = tracker
  const [view, setViewRaw] = useState('dash')

  const setView = useCallback((v) => {
    setViewRaw(v)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // imperative toast
  const [toastMsg, setToastMsg] = useState('')
  const toastT = useRef(null)
  const toast = useCallback((msg) => {
    setToastMsg(msg)
    clearTimeout(toastT.current)
    toastT.current = setTimeout(() => setToastMsg(''), 2200)
  }, [])
  useEffect(() => () => clearTimeout(toastT.current), [])

  const actions = tracker

  return (
    <>
      {!state.onboarded && (
        <Onboarding totalDays={metrics.totalDays} onConfirm={(d) => { actions.completeOnboarding(d); setView('combined') }} />
      )}

      <TopBar view={view} setView={setView} metrics={metrics} />
      <main>
        {!HAS_LS && (
          <div className="note-banner">
            ⚠ This environment can't save to your browser, so progress will reset on reload.
            Once you <b>build &amp; deploy this app</b> (or run it locally), your progress saves automatically.
          </div>
        )}

        {view === 'dash' && (
          <Dashboard
            metrics={metrics}
            dsaMetrics={metrics}
            theoryMetrics={theoryMetrics}
            startDate={state.startDate}
            slots={slots}
            state={state}
            onGoToPlan={() => setView('dsa')}
            onGoToCombined={() => setView('combined')}
          />
        )}
        {view === 'combined' && (
          <CombinedView dsaSlots={slots} theorySlots={theorySlots} state={state} actions={actions} toast={toast} />
        )}
        {view === 'dsa' && <PlanView slots={slots} state={state} actions={actions} toast={toast} />}
        {THEORY_KEYS.includes(view) && (
          <TheoryView
            key={view}
            subjectKey={view}
            slots={theorySlots}
            state={state}
            theoryMetrics={theoryMetrics}
            actions={actions}
            toast={toast}
          />
        )}
        {view === 'contests' && <Contests contests={state.contests} actions={actions} toast={toast} />}
      </main>

      <footer>
        Built for <b>Teesha and Rahul</b> · DSA cross-mapped to <b>LeetCode</b> &amp; <b>GeeksforGeeks</b> · CS theory: <b>OS</b> · DBMS · CN · OOP · <b>Day 1 = your start date</b> · Good luck on the climb. 🏔
      </footer>

      <div id="toast" className={toastMsg ? 'show' : ''}>{toastMsg}</div>
    </>
  )
}
