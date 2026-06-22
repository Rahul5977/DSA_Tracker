// Pure model helpers for the CS-theory tracker: turn SUBJECTS + saved theory
// state into an ordered list of day "slots" and aggregate metrics.
// Mirrors src/lib/model.js — no React, no side effects.

import { daysBetween, todayStr } from './dates.js'
import { streak } from './model.js'

// Every subject day, in study order (OS days, then DBMS, then CN, then OOP).
export function buildTheorySlots(SUBJECTS) {
  const slots = []
  let g = 0
  for (const subject of SUBJECTS) {
    subject.days.forEach((day, dayIdx) => {
      slots.push({
        g: g++,
        subjectKey: subject.key,
        subjectName: subject.name,
        subjectTag: subject.tag,
        dayIdx,
        focus: day.focus,
        concepts: day.concepts,
      })
    })
  }
  return slots
}

export function theoryDayKey(slot) {
  return `${slot.subjectKey}:${slot.dayIdx}`
}

export function conceptId(concept) {
  return concept.id
}

export function computeTheoryMetrics(SUBJECTS, theoryState, slots, startDate) {
  const today = todayStr()
  const m = {
    total: 0, solved: 0,
    byDate: {},
    bySubject: {},
    totalDays: slots.length,
  }
  const subjectAgg = {}
  for (const subject of SUBJECTS) {
    subjectAgg[subject.key] = { key: subject.key, name: subject.name, solved: 0, total: 0 }
  }
  for (const slot of slots) {
    const agg = subjectAgg[slot.subjectKey]
    slot.concepts.forEach((concept) => {
      const rec = theoryState.done[conceptId(concept)]
      const isDone = !!(rec && rec.done)
      m.total++
      agg.total++
      if (isDone) {
        m.solved++
        agg.solved++
        const d = rec.doneDate || today
        m.byDate[d] = (m.byDate[d] || 0) + 1
      }
    })
  }
  m.bySubject = subjectAgg
  const off = daysBetween(startDate, today)
  m.todayIdx = Math.max(0, Math.min(off, m.totalDays - 1))
  m.dayNumber = Math.max(1, Math.min(off + 1, m.totalDays))
  return m
}

// Consecutive days (ending today or yesterday) with at least one concept done.
export function theoryStreak(byDate) {
  return streak(byDate)
}
