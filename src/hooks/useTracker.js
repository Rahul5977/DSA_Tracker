import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PLAN } from '../data/plan.js'
import { loadState, saveState } from '../lib/storage.js'
import { buildSlots, computeMetrics, dayKey, probId } from '../lib/model.js'
import { SUBJECTS } from '../data/theory/index.js'
import { buildTheorySlots, computeTheoryMetrics, conceptId, theoryDayKey } from '../lib/theoryModel.js'
import { todayStr } from '../lib/dates.js'

export function defaultState() {
  return {
    startDate: todayStr(),
    done: {},      // id -> { done:true, doneDate:"YYYY-MM-DD" }
    buffers: {},   // phaseIdx -> [ { focus, items:[[t,src,diff,slug],...] }, ... ]
    notes: {},     // dayKey -> string
    open: {},      // dayKey -> bool
    custom: {},    // dayKey -> [ [t,src,diff,slug], ... ]   (user-added problems)
    contests: [],  // [{ name, date, solved, rank, rating, note }]
    onboarded: false, // has the user picked their Day 1 yet?
    theory: {        // parallel CS-theory tracking (OS, DBMS, CN, OOP)
      done: {},      // conceptId -> { done:true, doneDate:"YYYY-MM-DD" }
      notes: {},     // theoryDayKey -> string
      open: {},      // theoryDayKey -> bool
    },
  }
}

function hydrate() {
  const saved = loadState()
  const base = defaultState()
  if (saved && typeof saved === 'object') {
    for (const k of Object.keys(saved)) base[k] = saved[k]
    // existing users (saved before onboarding existed) shouldn't be re-prompted
    if (saved.onboarded === undefined) base.onboarded = true
  } else {
    // brand-new user: open the first day for them; ask for Day 1 first
    base.open['0:p0'] = true
  }
  // existing DSA users may have saved state before theory existed
  if (!base.theory) base.theory = { done: {}, notes: {}, open: {} }
  return base
}

export function useTracker() {
  const [state, setState] = useState(hydrate)

  // Debounced persistence.
  const saveT = useRef(null)
  useEffect(() => {
    clearTimeout(saveT.current)
    saveT.current = setTimeout(() => saveState(state), 120)
    return () => clearTimeout(saveT.current)
  }, [state])

  const slots = useMemo(() => buildSlots(PLAN, state), [state])
  const metrics = useMemo(() => computeMetrics(PLAN, state, slots), [state, slots])

  const theorySlots = useMemo(() => buildTheorySlots(SUBJECTS), [])
  const theoryMetrics = useMemo(
    () => computeTheoryMetrics(SUBJECTS, state.theory, theorySlots, state.startDate),
    [state, theorySlots],
  )

  // --- mutators ---------------------------------------------------------
  const toggleProblem = useCallback((slot, k) => {
    const id = probId(slot, k)
    setState((s) => {
      const done = { ...s.done }
      if (done[id] && done[id].done) delete done[id]
      else done[id] = { done: true, doneDate: todayStr() }
      return { ...s, done }
    })
  }, [])

  const toggleDayOpen = useCallback((slot) => {
    const key = dayKey(slot)
    setState((s) => ({ ...s, open: { ...s.open, [key]: !s.open[key] } }))
  }, [])

  const setAllOpen = useCallback((isOpen) => {
    setState((s) => {
      const open = {}
      buildSlots(PLAN, s).forEach((sl) => { open[dayKey(sl)] = isOpen })
      return { ...s, open }
    })
  }, [])

  const setNote = useCallback((slot, value) => {
    const key = dayKey(slot)
    setState((s) => ({ ...s, notes: { ...s.notes, [key]: value } }))
  }, [])

  // --- theory mutators --------------------------------------------------
  const toggleConcept = useCallback((conceptId) => {
    setState((s) => {
      const done = { ...s.theory.done }
      if (done[conceptId] && done[conceptId].done) delete done[conceptId]
      else done[conceptId] = { done: true, doneDate: todayStr() }
      return { ...s, theory: { ...s.theory, done } }
    })
  }, [])

  const toggleTheoryDayOpen = useCallback((slot) => {
    const key = theoryDayKey(slot)
    setState((s) => ({ ...s, theory: { ...s.theory, open: { ...s.theory.open, [key]: !s.theory.open[key] } } }))
  }, [])

  const setAllTheoryOpen = useCallback((isOpen) => {
    setState((s) => {
      const open = {}
      buildTheorySlots(SUBJECTS).forEach((sl) => { open[theoryDayKey(sl)] = isOpen })
      return { ...s, theory: { ...s.theory, open } }
    })
  }, [])

  const setTheoryNote = useCallback((slot, value) => {
    const key = theoryDayKey(slot)
    setState((s) => ({ ...s, theory: { ...s.theory, notes: { ...s.theory.notes, [key]: value } } }))
  }, [])

  const addCustomProblem = useCallback((slot, title) => {
    const t = title.trim()
    if (!t) return
    const item = [t, 'LC', 'M', '']
    setState((s) => {
      if (slot.kind === 'buffer') {
        const buffers = { ...s.buffers }
        const arr = (buffers[slot.phaseIdx] || []).map((b) => ({ ...b, items: [...b.items] }))
        arr[slot.bufIdx].items.push(item)
        buffers[slot.phaseIdx] = arr
        return { ...s, buffers }
      }
      const key = dayKey(slot)
      const custom = { ...s.custom }
      custom[key] = [...(custom[key] || []), item]
      return { ...s, custom }
    })
  }, [])

  const addBuffer = useCallback((phaseIdx, seedItems, focus) => {
    setState((s) => {
      const buffers = { ...s.buffers }
      const arr = [...(buffers[phaseIdx] || [])]
      arr.push({
        focus: focus || 'Catch-up / flex day',
        items: seedItems && seedItems.length
          ? seedItems
          : [['(Add the problems you want to redo here)', 'LC', 'M', '']],
      })
      buffers[phaseIdx] = arr
      return { ...s, buffers }
    })
  }, [])

  const carryOver = useCallback((slot) => {
    const unsolved = []
    slot.items.forEach((it, k) => {
      const r = state.done[probId(slot, k)]
      if (!(r && r.done) && !/^[↻🏔🛟]/.test(it[0])) unsolved.push([it[0], it[1], it[2], it[3]])
    })
    if (!unsolved.length) return 0
    addBuffer(slot.phaseIdx, unsolved, 'Carry-over from: ' + slot.focus)
    return unsolved.length
  }, [state, addBuffer])

  const setStartDate = useCallback((date) => {
    setState((s) => ({ ...s, startDate: date }))
  }, [])

  const completeOnboarding = useCallback((date) => {
    setState((s) => ({ ...s, startDate: date || s.startDate, onboarded: true }))
  }, [])

  // --- contests ---------------------------------------------------------
  const addContest = useCallback((c) => {
    setState((s) => ({ ...s, contests: [...s.contests, c] }))
  }, [])

  const removeContest = useCallback((idx) => {
    setState((s) => ({ ...s, contests: s.contests.filter((_, i) => i !== idx) }))
  }, [])

  // --- backup / reset ---------------------------------------------------
  const importState = useCallback((data) => {
    setState({ ...defaultState(), ...data })
  }, [])

  const resetAll = useCallback(() => {
    setState(defaultState())
  }, [])

  return {
    state, slots, metrics,
    toggleProblem, toggleDayOpen, setAllOpen, setNote,
    addCustomProblem, addBuffer, carryOver, setStartDate, completeOnboarding,
    addContest, removeContest, importState, resetAll,
    theorySlots, theoryMetrics,
    toggleConcept, toggleTheoryDayOpen, setAllTheoryOpen, setTheoryNote,
  }
}
